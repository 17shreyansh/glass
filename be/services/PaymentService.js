const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    // Check if Razorpay keys are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id' || 
        process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
      console.warn('WARNING: Razorpay API keys are not configured. Payment functionality will be disabled.');
      this.isConfigured = false;
      this.razorpay = null;
    } else {
      this.isConfigured = true;
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  /**
   * Creates an order with Razorpay.
   * @param {number} amountInPaise - The total amount in paise (smallest currency unit).
   * @param {string} orderNumber - Your internal order tracking number. This will be used as the receipt ID.
   * @param {string} userEmail - The email of the user placing the order.
   * @returns {object} - Object containing success status, Razorpay order details, or error.
   */
  async createRazorpayOrder(amountInPaise, orderNumber, userEmail) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      };
    }

    try {
      // Amount should already be in paise from the controller
      if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
        throw new Error('Invalid amount: must be a positive integer (in paise)');
      }

      // Log the amount for debugging
      console.log('[Razorpay] Amount details:', {
        amountInPaise,
        amountInRupees: amountInPaise / 100,
      });

      // Ensure orderNumber is a string and handle the 40-character limit
      let receiptValue = String(orderNumber);
      if (receiptValue.length > 40) {
        receiptValue = receiptValue.substring(0, 40);
      }

      const options = {
        amount: amountInPaise, // Already in paise
        currency: 'INR',
        receipt: receiptValue,
        notes: {
          originalOrderNumber: String(orderNumber),
          userEmail: userEmail,
        }
      };

      console.log('[Razorpay] Creating order:', {
        ...options,
        amountInRupees: amountInPaise / 100
      });

      const razorpayOrder = await this.razorpay.orders.create(options);
      console.log(`[Razorpay] Order created successfully: ${razorpayOrder.id}`);

      return {
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error.response?.data || error.message || error);
      return {
        success: false,
        error: error.response?.data?.error?.description || error.message || 'Failed to create Razorpay order.'
      };
    }
  }

  /**
   * Verifies a successful Razorpay payment and prepares order data
   * @param {string} razorpayOrderId - Razorpay order ID
   * @param {string} razorpayPaymentId - Payment ID from Razorpay
   * @param {string} razorpaySignature - Signature from Razorpay
   * @returns {boolean} - True if signature is valid, false otherwise
   */
  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    if (!this.isConfigured) {
      console.warn('Razorpay not configured - signature verification skipped');
      return false;
    }

    try {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;
      
      console.log('[PaymentService] Signature verification:', {
        isValid,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId
      });

      return isValid;
    } catch (error) {
      console.error('[PaymentService] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Verifies payment details with Razorpay API
   * @param {string} paymentId - The payment ID to verify
   * @returns {Promise<object>} - Object containing payment verification result
   */
  async verifyPayment(paymentId) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Razorpay is not configured'
      };
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      
      return {
        success: true,
        payment,
        status: payment.status,
        amount: payment.amount,
        email: payment.email
      };
    } catch (error) {
      console.error('[PaymentService] Payment verification failed:', error);
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Fetches detailed information about a specific payment from Razorpay.
   * @param {string} paymentId - The ID of the payment to fetch.
   * @returns {object} - Object containing success status and payment details, or error.
   */
  async getPaymentDetails(paymentId) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Razorpay is not configured'
      };
    }

    try {
      console.log(`[Razorpay] Fetching payment details for ID: ${paymentId}`);
      const payment = await this.razorpay.payments.fetch(paymentId);
      console.log(`[Razorpay] Payment details fetched successfully for ID: ${paymentId}`);
      return {
        success: true,
        payment
      };
    } catch (error) {
      console.error(`Failed to fetch payment details for ${paymentId}:`, error.response?.data || error.message || error);
      return {
        success: false,
        error: error.response?.data?.error?.description || error.message || 'Failed to fetch payment details.'
      };
    }
  }

  /**
   * Initiates a refund for a given payment ID.
   * @param {string} paymentId - The ID of the payment to refund.
   * @param {number} amount - The amount to refund (in your currency). Optional for full refund.
   * @param {string} reason - The reason for the refund.
   * @returns {object} - Object containing success status, refund ID, and status, or error.
   */
  async refundPayment(paymentId, amount, reason = 'Order cancelled') {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Razorpay is not configured'
      };
    }

    try {
      const amountInPaise = Math.round(amount * 100); // Amount in paise
      console.log(`[Razorpay] Initiating refund for Payment ID: ${paymentId}, Amount: ₹${amount}, Reason: ${reason}`);
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amountInPaise,
        notes: { reason }
      });

      console.log(`[Razorpay] Refund initiated successfully. Refund ID: ${refund.id}, Status: ${refund.status}`);
      return {
        success: true,
        refundId: refund.id,
        status: refund.status
      };
    } catch (error) {
      console.error(`Payment refund failed for ${paymentId}:`, error.response?.data || error.message || error);
      return {
        success: false,
        error: error.response?.data?.error?.description || error.message || 'Failed to process refund.'
      };
    }
  }
}

module.exports = new PaymentService();