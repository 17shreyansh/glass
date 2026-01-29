import React, { useState, useEffect } from 'react';
import { Layout, Steps, Form, Input, Button, Card, Row, Col, Typography, Radio, message, Spin, Divider, InputNumber, Modal, Select, Empty } from 'antd';
import { DeleteOutlined, RightOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal, updateQuantity, removeFromCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountOnDelivery, setDiscountOnDelivery] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [codEnabled, setCodEnabled] = useState(true);

  useEffect(() => {
    if (cartItems.length > 0 && !isAuthenticated()) {
      return;
    }
    if (isAuthenticated()) {
      fetchAddresses();
    }
    fetchCODStatus();
  }, [isAuthenticated]);

  const fetchCODStatus = async () => {
    try {
      const response = await apiService.request('/orders/cod-status');
      setCodEnabled(response.codEnabled);
    } catch (error) {
      console.error('Failed to fetch COD status:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiService.request('/user/addresses');
      setAddresses(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedAddress(response.data[0]._id);
        fetchDeliveryCharge(response.data[0].pincode);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const fetchDeliveryCharge = async (pincode) => {
    if (!pincode) return;
    setLoadingDelivery(true);
    try {
      const response = await apiService.request(`/orders/check-pincode?pincode=${pincode}`);
      if (response.success && response.couriers && response.couriers.length > 0) {
        const charges = response.couriers.map(c => c.rate || c.freight_charge || 0);
        setDeliveryCharge(Math.min(...charges));
      } else {
        setDeliveryCharge(100);
      }
    } catch (error) {
      console.error('Failed to fetch delivery charge:', error);
      setDeliveryCharge(100);
    } finally {
      setLoadingDelivery(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      message.warning('Please enter a coupon code');
      return;
    }

    const address = addresses.find(a => a._id === selectedAddress);
    if (!address || !address.pincode) {
      message.warning('Please select a delivery address first');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    
    try {
      const response = await apiService.applyCoupon({
        couponCode: coupon,
        items: cartItems.map(item => ({
          _id: item._id || item.id,
          size: item.size || 'Standard',
          color: item.color || 'Default',
          quantity: item.quantity
        })),
        shippingAddress: {
          city: address.city,
          state: address.state,
          pincode: address.pincode
        }
      });

      if (response.success) {
        const calc = response.calculation;
        setDiscountAmount(calc.discountAmount);
        setDiscountOnDelivery(calc.discountOnDelivery);
        setDeliveryCharge(calc.deliveryCharge);
        message.success(`Coupon applied! You saved ₹${calc.savings}`);
      }
    } catch (error) {
      setCouponError(error.message || 'Invalid coupon code');
      setDiscountAmount(0);
      setDiscountOnDelivery(0);
      message.error(error.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const values = await form.validateFields();
      
      if (!isAuthenticated()) {
        const newAddr = { ...values, _id: Date.now().toString() };
        setAddresses([...addresses, newAddr]);
        setSelectedAddress(newAddr._id);
        fetchDeliveryCharge(values.pincode);
        message.success('Address added');
      } else {
        await apiService.request('/user/addresses', {
          method: 'POST',
          body: JSON.stringify(values)
        });
        message.success('Address added successfully');
        fetchAddresses();
      }
      
      setIsAddressModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      message.error('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      message.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      if (!isAuthenticated()) {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
          message.error('Please fill in all required fields');
          setLoading(false);
          return;
        }
        
        const address = addresses.find(a => a._id === selectedAddress);
        if (!address) {
          message.error('Please add a delivery address');
          setLoading(false);
          return;
        }

        try {
          const registerResponse = await apiService.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              name: guestInfo.name,
              email: guestInfo.email,
              password: Math.random().toString(36).slice(-8) + 'Aa1!',
              phone: guestInfo.phone,
              skipEmailVerification: true
            })
          });
          
          if (registerResponse.success) {
            window.location.reload();
            return;
          }
        } catch (error) {
          if (error.message?.includes('already registered')) {
            Modal.confirm({
              title: 'Account Already Exists',
              content: `An account with ${guestInfo.email} already exists. Please login to continue.`,
              okText: 'Login',
              cancelText: 'Cancel',
              onOk: () => {
                navigate('/login', { state: { from: '/checkout' } });
              }
            });
            setLoading(false);
            return;
          }
          message.error(error.message || 'Failed to create account');
          setLoading(false);
          return;
        }
      }
      
      const address = addresses.find(a => a._id === selectedAddress);
      
      if (!address) {
        message.error('Selected address not found');
        setLoading(false);
        return;
      }

      const validItems = cartItems
        .filter(item => (item._id || item.id) && item.name && item.price && item.quantity)
        .map(item => ({
          _id: item._id || item.id,
          size: item.size || 'Standard',
          color: item.color || 'Default',
          quantity: Number(item.quantity)
        }));

      if (validItems.length === 0) {
        message.error('No valid items in cart');
        setLoading(false);
        return;
      }
      
      const orderData = {
        items: validItems,
        shippingAddress: {
          fullName: address.name,
          phone: address.phone,
          email: guestInfo.email || user?.email || address.email || '',
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: 'India'
        },
        paymentMethod: paymentMethod,
        couponCode: coupon || undefined
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        // For COD orders, order is already created
        if (paymentMethod === 'COD') {
          message.success('Order placed successfully! Pay on delivery.');
          clearCart();
          navigate('/account/orders');
        } else {
          // For Razorpay payments
          const options = {
            key: response.razorpayDetails.key,
            amount: response.razorpayDetails.amount,
            currency: response.razorpayDetails.currency,
            order_id: response.razorpayDetails.orderId,
            name: 'MV Crafted IMPEX',
            description: 'Order Payment',
            handler: async function (paymentResponse) {
              try {
                const verifyData = {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderData: response.orderData
                };
                
                const verifyResponse = await apiService.verifyPayment(verifyData);
                if (verifyResponse.success) {
                  message.success('Payment successful! Order placed.');
                  clearCart();
                  navigate('/account/orders');
                }
              } catch (error) {
                message.error('Payment verification failed');
              }
            },
            prefill: {
              name: address.name,
              email: guestInfo.email || user?.email,
              contact: address.phone
            },
            theme: {
              color: '#8E6A4E'
            }
          };
          
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        }
      }
    } catch (error) {
      message.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const taxableAmount = subtotal - discountAmount;
  const gst = Math.round((taxableAmount * 0.18) * 100) / 100;
  const total = subtotal - discountAmount + deliveryCharge - discountOnDelivery + gst;

  const styles = {
    page: { marginTop: 80, padding: '20px 5%', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", background: '#fff' },
    card: { borderRadius: 10, border: '1px solid #ddd', padding: '15px', background: '#fff', marginBottom: 16 },
    sectionTitle: { fontWeight: 600, marginBottom: 10, fontSize: 16 },
    summaryCard: { borderRadius: 8, border: '1px solid #ddd', background: '#fff', padding: '20px 20px 5px 20px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 },
    divider: { margin: '8px 0' },
    addressCard: (isActive) => ({
      border: isActive ? '1px solid #8E6A4E' : '1px solid #ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      background: isActive ? '#fef6f0' : '#fff',
      cursor: 'pointer'
    })
  };

  if (cartItems.length === 0) {
    return (
      <Layout style={{ background: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="Your cart is empty">
          <Link to="/shop"><Button type="primary" style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }}>Continue Shopping</Button></Link>
        </Empty>
      </Layout>
    );
  }

  return (
    <Layout style={{ background: '#fff', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
      <div style={styles.page}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 10 }}>Checkout</Title>
        
        <Steps current={step} style={{ maxWidth: 500, margin: '0 auto 40px auto' }} items={[
          { title: 'Cart' },
          { title: 'Address & Payment' }
        ]} />

        {step === 0 ? (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              {cartItems.map((item, i) => (
                <Card key={item._id || i} style={styles.card}>
                  <Row align="middle" gutter={[8, 16]}>
                    <Col xs={6} sm={4}>
                      <img src={item.image || item.mainImage || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }} />
                    </Col>
                    <Col xs={18} sm={10}>
                      <Title level={5} style={{ marginBottom: 0, fontSize: '16px' }}>{item.name}</Title>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Product Type: {item.productType || 'N/A'}</Text><br />
                      <Text strong>₹{item.price}</Text>
                    </Col>
                    <Col xs={12} sm={4} style={{ textAlign: 'center' }}>
                      <Text style={{ fontSize: '12px' }}>Quantity</Text>
                      <InputNumber min={1} max={10} value={item.quantity || 1} onChange={(value) => updateQuantity(item._id, value)} style={{ width: '100%' }} />
                    </Col>
                    <Col xs={12} sm={6} style={{ textAlign: 'right' }}>
                      <Text strong>₹{(item.price * (item.quantity || 1)).toFixed(2)}</Text><br />
                      <Button type="text" danger icon={<DeleteOutlined />} size="small" style={{ marginTop: 5 }} onClick={() => removeFromCart(item._id)}>Remove</Button>
                    </Col>
                  </Row>
                </Card>
              ))}

              <Card style={{ ...styles.card, marginTop: 20 }}>
                <div style={styles.sectionTitle}>APPLY COUPON</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Input 
                    placeholder="Enter coupon code" 
                    value={coupon} 
                    onChange={(e) => {
                      setCoupon(e.target.value.toUpperCase());
                      setCouponError('');
                    }} 
                    size="large"
                    status={couponError ? 'error' : ''}
                  />
                  <Button 
                    icon={<RightOutlined />} 
                    style={{ background: '#8E6A4E', color: '#fff', borderRadius: 6 }} 
                    size="large"
                    onClick={handleApplyCoupon}
                    loading={applyingCoupon}
                  >
                    APPLY
                  </Button>
                </div>
                {couponError && <Text type="danger" style={{ fontSize: 12, marginTop: 5, display: 'block' }}>{couponError}</Text>}
                {(discountAmount > 0 || discountOnDelivery > 0) && <Text type="success" style={{ fontSize: 12, marginTop: 5, display: 'block', color: '#52c41a' }}>✓ Coupon applied successfully!</Text>}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card style={styles.summaryCard}>
                <Title level={4} style={{ marginBottom: 20 }}>Order Summary</Title>
                <div style={styles.summaryRow}><span>Subtotal ({cartItems.length} items):</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Discount ({coupon}):</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                  </>
                )}
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>GST (18%):</span><span>₹{gst.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>Shipping:</span><span>{loadingDelivery ? 'Calculating...' : deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}</span></div>
                {discountOnDelivery > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Delivery Discount:</span><span>-₹{discountOnDelivery.toFixed(2)}</span></div>
                  </>
                )}
                <Divider style={styles.divider} />
                <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18, color: '#000', marginTop: 10 }}><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
              </Card>

              <Button type="primary" block size="large" style={{ background: '#8E6A4E', borderColor: '#8E6A4E', marginTop: 20, height: 50, fontSize: 16, fontWeight: 600 }} onClick={() => setStep(1)}>PROCEED TO ADDRESS</Button>

              <div style={{ marginTop: 20, textAlign: 'center', padding: '15px', background: '#f5f5f5', borderRadius: 8 }}>
                <Text style={{ color: '#666', fontSize: 13 }}>🔒 Secure Payment</Text><br />
                <Text style={{ color: '#999', fontSize: 12 }}>Online Payment • {codEnabled ? 'Cash on Delivery' : ''}</Text>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              {!isAuthenticated() && (
                <Card style={{ ...styles.card, marginBottom: 20 }}>
                  <div style={styles.sectionTitle}>YOUR DETAILS</div>
                  <Form layout="vertical">
                    <Form.Item label="Full Name" required>
                      <Input size="large" value={guestInfo.name} onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})} placeholder="Enter your name" />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Email" required>
                          <Input size="large" type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})} placeholder="your@email.com" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Phone" required>
                          <Input size="large" value={guestInfo.phone} onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})} placeholder="10-digit number" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              )}
              
              <div style={{ marginBottom: 30 }}>
                <div style={styles.sectionTitle}>SELECT DELIVERY ADDRESS</div>
                {addresses.length === 0 ? (
                  <Empty description="No saved addresses" style={{ margin: '20px 0' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddressModalVisible(true)} style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }}>Add Address</Button>
                  </Empty>
                ) : (
                  addresses.map(addr => (
                    <div key={addr._id} style={styles.addressCard(selectedAddress === addr._id)} onClick={() => {
                      setSelectedAddress(addr._id);
                      fetchDeliveryCharge(addr.pincode);
                    }}>
                      <Radio checked={selectedAddress === addr._id} />
                      <div style={{ marginLeft: 10 }}>
                        <Text strong>{addr.type?.toUpperCase() || 'ADDRESS'}</Text>
                        <div>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</div>
                        <div style={{ color: '#666' }}>{addr.name} {addr.phone}</div>
                      </div>
                    </div>
                  ))
                )}
                {addresses.length > 0 && (
                  <Button icon={<PlusOutlined />} style={{ borderColor: '#8E6A4E', color: '#8E6A4E', marginTop: 10 }} onClick={() => setIsAddressModalVisible(true)}>Add New Address</Button>
                )}
              </div>

              <div style={{ marginTop: 30 }}>
                <div style={styles.sectionTitle}>SELECT PAYMENT METHOD</div>
                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', marginBottom: 20 }}>
                  <div style={{ ...styles.addressCard(paymentMethod === 'RAZORPAY'), marginBottom: 10 }}>
                    <Radio value="RAZORPAY">
                      <div style={{ marginLeft: 10 }}>
                        <Text strong>Online Payment (Razorpay)</Text>
                        <div style={{ color: '#666', fontSize: 12 }}>UPI, Cards, Net Banking, Wallets</div>
                      </div>
                    </Radio>
                  </div>
                  {codEnabled && (
                    <div style={styles.addressCard(paymentMethod === 'COD')}>
                      <Radio value="COD">
                        <div style={{ marginLeft: 10 }}>
                          <Text strong>Cash on Delivery (COD)</Text>
                          <div style={{ color: '#666', fontSize: 12 }}>Pay when you receive the order</div>
                        </div>
                      </Radio>
                    </div>
                  )}
                </Radio.Group>
              </div>

              <div style={{ marginTop: 20 }}>
                <Button onClick={() => setStep(0)} style={{ marginRight: 10 }}>Back</Button>
                <Button type="primary" style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }} onClick={handlePlaceOrder} loading={loading} disabled={!isAuthenticated() && (!guestInfo.name || !guestInfo.email || !guestInfo.phone)}>
                  {paymentMethod === 'COD' ? 'PLACE ORDER' : 'PLACE ORDER & PAY'}
                </Button>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card style={styles.summaryCard}>
                <Title level={4} style={{ marginBottom: 20 }}>Order Summary</Title>
                <div style={styles.summaryRow}><span>Subtotal ({cartItems.length} items):</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Discount ({coupon}):</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                  </>
                )}
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>GST (18%):</span><span>₹{gst.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>Shipping:</span><span>{loadingDelivery ? 'Calculating...' : deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}</span></div>
                {discountOnDelivery > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Delivery Discount:</span><span>-₹{discountOnDelivery.toFixed(2)}</span></div>
                  </>
                )}
                <Divider style={styles.divider} />
                <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18, color: '#000', marginTop: 10 }}><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
              </Card>
            </Col>
          </Row>
        )}

        <Modal title="Add New Address" open={isAddressModalVisible} onOk={handleAddAddress} onCancel={() => { setIsAddressModalVisible(false); form.resetFields(); }} okButtonProps={{ style: { background: '#8E6A4E', borderColor: '#8E6A4E' } }}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="type" label="Address Type" rules={[{ required: true }]}>
              <Select><Option value="home">Home</Option><Option value="office">Office</Option><Option value="other">Other</Option></Select>
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="city" label="City" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Select showSearch>
                  <Option value="Andhra Pradesh">Andhra Pradesh</Option>
                  <Option value="Arunachal Pradesh">Arunachal Pradesh</Option>
                  <Option value="Assam">Assam</Option>
                  <Option value="Bihar">Bihar</Option>
                  <Option value="Chhattisgarh">Chhattisgarh</Option>
                  <Option value="Goa">Goa</Option>
                  <Option value="Gujarat">Gujarat</Option>
                  <Option value="Haryana">Haryana</Option>
                  <Option value="Himachal Pradesh">Himachal Pradesh</Option>
                  <Option value="Jharkhand">Jharkhand</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Kerala">Kerala</Option>
                  <Option value="Madhya Pradesh">Madhya Pradesh</Option>
                  <Option value="Maharashtra">Maharashtra</Option>
                  <Option value="Manipur">Manipur</Option>
                  <Option value="Meghalaya">Meghalaya</Option>
                  <Option value="Mizoram">Mizoram</Option>
                  <Option value="Nagaland">Nagaland</Option>
                  <Option value="Odisha">Odisha</Option>
                  <Option value="Punjab">Punjab</Option>
                  <Option value="Rajasthan">Rajasthan</Option>
                  <Option value="Sikkim">Sikkim</Option>
                  <Option value="Tamil Nadu">Tamil Nadu</Option>
                  <Option value="Telangana">Telangana</Option>
                  <Option value="Tripura">Tripura</Option>
                  <Option value="Uttar Pradesh">Uttar Pradesh</Option>
                  <Option value="Uttarakhand">Uttarakhand</Option>
                  <Option value="West Bengal">West Bengal</Option>
                  <Option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</Option>
                  <Option value="Chandigarh">Chandigarh</Option>
                  <Option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</Option>
                  <Option value="Delhi">Delhi</Option>
                  <Option value="Jammu and Kashmir">Jammu and Kashmir</Option>
                  <Option value="Ladakh">Ladakh</Option>
                  <Option value="Lakshadweep">Lakshadweep</Option>
                  <Option value="Puducherry">Puducherry</Option>
                </Select>
              </Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="phone" label="Phone" rules={[{ required: true }]}><Input /></Form.Item></Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Checkout;
