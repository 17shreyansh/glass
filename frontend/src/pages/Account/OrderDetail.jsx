import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Steps, Divider, Button, Tag, Spin, message, Space } from 'antd';
import { DownloadOutlined, ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import apiService from '../../services/api';

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await apiService.getOrder(orderId);
      setOrder(response.order || response.data);
    } catch (error) {
      message.error('Failed to fetch order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#D4A574',
      CONFIRMED: '#8E6A4E',
      PROCESSING: '#8E6A4E',
      SHIPPED: '#8E6A4E',
      DELIVERED: '#6B8E23',
      CANCELLED: '#d32f2f'
    };
    return colors[status] || '#999';
  };

  const getStatusStep = (status) => {
    const steps = { PENDING: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4, CANCELLED: -1 };
    return steps[status] || 0;
  };

  const handleDownloadInvoice = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/orders/invoice/${orderId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Invoice downloaded successfully');
    } catch (error) {
      message.error('Failed to download invoice');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="Order Details">
        <AccountContent>
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <Spin size="large" />
          </div>
        </AccountContent>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout title="Order Details">
        <AccountContent>
          <Card style={{ textAlign: 'center', padding: '40px', borderRadius: 12 }}>
            <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Order not found</Text>
          </Card>
        </AccountContent>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title={`Order #${order.orderNumber}`}>
      <AccountContent>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/account/orders')} 
          style={{ 
            marginBottom: 24, 
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", 
            borderColor: '#8E6A4E', 
            color: '#8E6A4E', 
            borderRadius: 8,
            height: 40
          }}
        >
          Back to Orders
        </Button>

        <Card 
          bordered={false}
          style={{ 
            marginBottom: 24, 
            background: '#fef6f0',
            borderRadius: 12,
            border: '1px solid #e8d5c4',
            padding: '16px'
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Row justify="space-between" align="middle" style={{ margin: 0 }}>
            <Col xs={24} sm={16} style={{ padding: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#8E6A4E', marginBottom: 8, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                Order #{order.orderNumber}
              </div>
              <Text style={{ fontSize: 14, color: '#666', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                Placed on {new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'right', padding: '8px' }}>
              <div style={{ 
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: 20,
                background: getStatusColor(order.status),
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
              }}>
                {order.status}
              </div>
            </Col>
          </Row>
        </Card>

        {order.status !== 'CANCELLED' && (
          <Card 
            bordered={false}
            style={{ 
              marginBottom: 24,
              borderRadius: 12,
              border: '1px solid #e8e8e8'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 24, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
              Order Progress
            </div>
            <Steps 
              current={getStatusStep(order.status)} 
              style={{ marginBottom: 32 }}
              items={[
                { title: <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 13 }}>Placed</span> },
                { title: <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 13 }}>Confirmed</span> },
                { title: <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 13 }}>Processing</span> },
                { title: <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 13 }}>Shipped</span> },
                { title: <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 13 }}>Delivered</span> }
              ]}
            />

            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {order.placedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ClockCircleOutlined style={{ fontSize: 16, color: '#8E6A4E' }} />
                  <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>
                    Order Placed - {new Date(order.placedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {order.confirmedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircleOutlined style={{ fontSize: 16, color: '#8E6A4E' }} />
                  <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>
                    Order Confirmed - {new Date(order.confirmedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {order.shippedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircleOutlined style={{ fontSize: 16, color: '#8E6A4E' }} />
                  <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>
                    Order Shipped - {new Date(order.shippedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {order.deliveredAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircleOutlined style={{ fontSize: 16, color: '#6B8E23' }} />
                  <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>
                    Order Delivered - {new Date(order.deliveredAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </Space>

            {order.trackingNumber && (
              <div style={{ marginTop: 24, padding: 16, background: '#fef6f0', borderRadius: 10, border: '1px solid #e8d5c4' }}>
                <Text strong style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: '#8E6A4E', fontSize: 14 }}>Tracking Number: </Text>
                <Text copyable style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14 }}>{order.trackingNumber}</Text>
              </div>
            )}
          </Card>
        )}

        <Row gutter={[20, 20]} style={{ margin: '0 -10px' }}>
          <Col xs={24} lg={16} style={{ padding: '0 10px', marginBottom: '20px' }}>
            <Card 
              bordered={false}
              style={{ 
                marginBottom: 20,
                borderRadius: 12,
                border: '1px solid #e8e8e8'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 20, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                Order Items
              </div>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {order.items?.map((item, index) => (
                  <div key={index} style={{ paddingBottom: 16, borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Row gutter={16} align="middle" style={{ margin: 0 }}>
                      <Col xs={8} sm={6} md={5} style={{ padding: '0 8px' }}>
                        <img 
                          src={item.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${item.image}` : 'https://via.placeholder.com/100'} 
                          alt={item.name} 
                          style={{ 
                            width: '100%', 
                            aspectRatio: '1',
                            borderRadius: 10,
                            objectFit: 'cover',
                            border: '1px solid #f0f0f0'
                          }} 
                        />
                      </Col>
                      <Col xs={16} sm={12} md={13} style={{ padding: '0 8px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 6, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 13, color: '#666', marginBottom: 4, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          Size: {item.size} | Color: {item.color}
                        </div>
                        <div style={{ fontSize: 13, color: '#999', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          Qty: {item.quantity}
                        </div>
                      </Col>
                      <Col xs={24} sm={6} md={6} style={{ textAlign: 'right', marginTop: '8px', padding: '0 8px' }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Space>
            </Card>

            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                border: '1px solid #e8e8e8'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 16, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                Shipping Address
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 8, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                {order.shippingAddress?.fullName}
              </div>
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                Phone: {order.shippingAddress?.phone}<br />
                Email: {order.shippingAddress?.email}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8} style={{ padding: '0 10px' }}>
            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                background: '#fefefe'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 20, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                Order Summary
              </div>
              
              <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 16 }}>
                <Row justify="space-between">
                  <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>Subtotal</Text>
                  <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#333' }}>₹{order.subtotal?.toLocaleString('en-IN')}</Text>
                </Row>
                <Row justify="space-between">
                  <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>Delivery Charge</Text>
                  <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#333' }}>₹{order.deliveryCharge?.toLocaleString('en-IN')}</Text>
                </Row>
                {order.discountAmount > 0 && (
                  <Row justify="space-between">
                    <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#6B8E23' }}>Discount</Text>
                    <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#6B8E23' }}>-₹{order.discountAmount?.toLocaleString('en-IN')}</Text>
                  </Row>
                )}
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Text strong style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 16, color: '#333' }}>Total</Text>
                <Text strong style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 20, color: '#8E6A4E' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</Text>
              </Row>

              <Divider style={{ margin: '16px 0' }} />

              <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 20 }}>
                <div>
                  <Text strong style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#333', display: 'block', marginBottom: 6 }}>Payment Method</Text>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: '#fef6f0',
                    color: '#8E6A4E',
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
                  }}>
                    {order.payment?.method}
                  </div>
                </div>
                <div>
                  <Text strong style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#333', display: 'block', marginBottom: 6 }}>Payment Status</Text>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: order.payment?.status === 'PAID' ? '#f0f8f0' : '#fff9f0',
                    color: order.payment?.status === 'PAID' ? '#6B8E23' : '#D4A574',
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
                  }}>
                    {order.payment?.status}
                  </div>
                </div>
              </Space>

              <Button 
                type="primary" 
                block 
                icon={<DownloadOutlined />} 
                onClick={handleDownloadInvoice} 
                style={{ 
                  marginTop: 8,
                  background: '#8E6A4E', 
                  borderColor: '#8E6A4E', 
                  fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", 
                  borderRadius: 8, 
                  height: 44,
                  fontSize: 15,
                  fontWeight: 500
                }}
              >
                Download Invoice
              </Button>

              {order.status === 'PENDING' && (
                <Button 
                  danger 
                  block 
                  style={{ 
                    marginTop: 12, 
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", 
                    borderRadius: 8, 
                    height: 44,
                    fontSize: 15,
                    fontWeight: 500
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </Card>

            {order.notes && (
              <Card 
                bordered={false}
                style={{ 
                  marginTop: 20,
                  borderRadius: 12,
                  border: '1px solid #e8e8e8'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                  Order Notes
                </div>
                <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: 14, color: '#666' }}>{order.notes}</Text>
              </Card>
            )}
          </Col>
        </Row>
      </AccountContent>
    </AccountLayout>
  );
};

export default OrderDetail;
