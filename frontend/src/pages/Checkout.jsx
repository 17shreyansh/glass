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

  useEffect(() => {
    if (!isAuthenticated()) {
      message.error('Please login to continue');
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await apiService.request('/user/addresses');
      setAddresses(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedAddress(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const values = await form.validateFields();
      await apiService.request('/user/addresses', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      message.success('Address added successfully');
      setIsAddressModalVisible(false);
      form.resetFields();
      fetchAddresses();
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

      console.log('Order items:', validItems);
      
      const orderData = {
        items: validItems,
        shippingAddress: {
          fullName: address.name,
          phone: address.phone,
          email: user?.email || address.email || '',
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: 'India'
        },
        paymentMethod: 'RAZORPAY',
        couponCode: coupon || undefined
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
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
            email: user?.email,
            contact: address.phone
          },
          theme: {
            color: '#8E6A4E'
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      message.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = 0;
  const gst = Math.round((subtotal * 0.18) * 100) / 100;
  const total = subtotal + gst;

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
                  <Input placeholder="Enter coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} size="large" />
                  <Button icon={<RightOutlined />} style={{ background: '#8E6A4E', color: '#fff', borderRadius: 6 }} size="large">APPLY</Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card style={styles.summaryCard}>
                <Title level={4} style={{ marginBottom: 20 }}>Order Summary</Title>
                <div style={styles.summaryRow}><span>Subtotal ({cartItems.length} items):</span><span>₹{subtotal.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>GST (18%):</span><span>₹{gst.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>Shipping:</span><span style={{ color: '#52c41a' }}>FREE</span></div>
                <Divider style={styles.divider} />
                {coupon && (
                  <>
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Coupon Discount:</span><span>-₹0</span></div>
                    <Divider style={styles.divider} />
                  </>
                )}
                <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18, color: '#000', marginTop: 10 }}><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
              </Card>

              <Button type="primary" block size="large" style={{ background: '#8E6A4E', borderColor: '#8E6A4E', marginTop: 20, height: 50, fontSize: 16, fontWeight: 600 }} onClick={() => setStep(1)}>PROCEED TO ADDRESS</Button>

              <div style={{ marginTop: 20, textAlign: 'center', padding: '15px', background: '#f5f5f5', borderRadius: 8 }}>
                <Text style={{ color: '#666', fontSize: 13 }}>🔒 Secure Payment via Razorpay</Text><br />
                <Text style={{ color: '#999', fontSize: 12 }}>UPI • Cards • Net Banking</Text>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div style={{ marginBottom: 30 }}>
                <div style={styles.sectionTitle}>SELECT DELIVERY ADDRESS</div>
                {addresses.length === 0 ? (
                  <Empty description="No saved addresses" style={{ margin: '20px 0' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddressModalVisible(true)} style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }}>Add Address</Button>
                  </Empty>
                ) : (
                  addresses.map(addr => (
                    <div key={addr._id} style={styles.addressCard(selectedAddress === addr._id)} onClick={() => setSelectedAddress(addr._id)}>
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
                <Button onClick={() => setStep(0)} style={{ marginRight: 10 }}>Back</Button>
                <Button type="primary" style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }} onClick={handlePlaceOrder} loading={loading}>PLACE ORDER & PAY</Button>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card style={styles.summaryCard}>
                <Title level={4} style={{ marginBottom: 20 }}>Order Summary</Title>
                <div style={styles.summaryRow}><span>Subtotal ({cartItems.length} items):</span><span>₹{subtotal.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>GST (18%):</span><span>₹{gst.toFixed(2)}</span></div>
                <Divider style={styles.divider} />
                <div style={styles.summaryRow}><span>Shipping:</span><span style={{ color: '#52c41a' }}>FREE</span></div>
                <Divider style={styles.divider} />
                {coupon && (
                  <>
                    <div style={{ ...styles.summaryRow, color: '#52c41a' }}><span>Coupon Discount:</span><span>-₹0</span></div>
                    <Divider style={styles.divider} />
                  </>
                )}
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
                <Select><Option value="maharashtra">Maharashtra</Option><Option value="delhi">Delhi</Option><Option value="karnataka">Karnataka</Option><Option value="gujarat">Gujarat</Option></Select>
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