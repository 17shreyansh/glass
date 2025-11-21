import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Row, Col, Spin, Empty } from 'antd';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import apiService from '../../services/api';

const { Text } = Typography;

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('Ordered');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Add sample data for testing
        setOrders([
          {
            _id: 'sample1',
            items: [{ product: { name: 'Sample Product', mainImage: null } }],
            status: 'pending',
            totalAmount: 2500,
            createdAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const tabs = ['Ordered', 'Track Order', 'Delivered', 'Order History'];

  return (
    <AccountLayout title="My Orders">
      <AccountContent>
        <div className="account-tabs">
          {tabs.map((tab) => (
            <Button
              key={tab}
              type={activeTab === tab ? 'primary' : 'default'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
            </div>
          ) : orders.length === 0 ? (
            <Empty description="No orders found" />
          ) : (
            orders.map((order) => (
              <Card key={order._id} className="account-card" bordered={false}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={6} sm={4} md={3}>
                    <img
                      src={order.items?.[0]?.product?.mainImage ? 
                        `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${order.items[0].product.mainImage}` : 
                        'https://via.placeholder.com/80'
                      }
                      alt="Product"
                      style={{
                        width: '100%',
                        maxWidth: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                      }}
                    />
                  </Col>
                  <Col xs={18} sm={14} md={15}>
                    <Text strong style={{ display: 'block', color: '#114D4D', marginBottom: '4px' }}>
                      {order.items?.[0]?.product?.name || order.items?.[0]?.name || 'Product Name'}
                    </Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>
                      Order ID: {order._id?.slice(-8) || order.id?.slice(-8) || 'N/A'}
                    </Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      {getStatusText(order.status)} - {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                    </Text>
                  </Col>
                  <Col xs={12} sm={3} md={3} style={{ textAlign: 'center' }}>
                    <Text>₹{order.totalAmount?.toLocaleString()}</Text>
                  </Col>
                  <Col xs={12} sm={3} md={3} style={{ textAlign: 'right' }}>
                    <Button type="link" style={{ color: '#114D4D', padding: 0 }}>
                      View details
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </div>
      </AccountContent>
    </AccountLayout>
  );
};

export default MyOrders;
