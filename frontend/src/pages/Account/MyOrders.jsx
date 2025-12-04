import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Row, Col, Spin, Empty, Tag, Input, Select, Space } from 'antd';
import { EyeOutlined, SearchOutlined, ShoppingOutlined, ClockCircleOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import apiService from '../../services/api';

const { Text, Title } = Typography;
const { Option } = Select;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders();
      const orderData = response.orders || response.data || [];
      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
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

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length
    };
  };

  const stats = getOrderStats();

  return (
    <AccountLayout title="My Orders">
      <AccountContent>
        <Row gutter={[16, 16]} style={{ marginBottom: 24, margin: '0 0 24px 0' }}>
          <Col xs={12} sm={6} style={{ padding: '0 8px' }}>
            <Card 
              bordered={false}
              style={{ 
                background: '#fef6f0',
                borderRadius: 12,
                textAlign: 'center',
                padding: '12px 8px',
                margin: '8px 0'
              }}
            >
              <ShoppingOutlined style={{ fontSize: 24, color: '#8E6A4E', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", lineHeight: 1.2 }}>{stats.total}</div>
              <div style={{ fontSize: 13, color: '#666', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", marginTop: 4 }}>Total Orders</div>
            </Card>
          </Col>
          <Col xs={12} sm={6} style={{ padding: '0 8px' }}>
            <Card 
              bordered={false}
              style={{ 
                background: '#fff9f0',
                borderRadius: 12,
                textAlign: 'center',
                padding: '12px 8px',
                margin: '8px 0'
              }}
            >
              <ClockCircleOutlined style={{ fontSize: 24, color: '#D4A574', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 600, color: '#D4A574', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", lineHeight: 1.2 }}>{stats.pending}</div>
              <div style={{ fontSize: 13, color: '#666', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", marginTop: 4 }}>Pending</div>
            </Card>
          </Col>
          <Col xs={12} sm={6} style={{ padding: '0 8px' }}>
            <Card 
              bordered={false}
              style={{ 
                background: '#f5f8f0',
                borderRadius: 12,
                textAlign: 'center',
                padding: '12px 8px',
                margin: '8px 0'
              }}
            >
              <RocketOutlined style={{ fontSize: 24, color: '#8E6A4E', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", lineHeight: 1.2 }}>{stats.shipped}</div>
              <div style={{ fontSize: 13, color: '#666', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", marginTop: 4 }}>Shipped</div>
            </Card>
          </Col>
          <Col xs={12} sm={6} style={{ padding: '0 8px' }}>
            <Card 
              bordered={false}
              style={{ 
                background: '#f0f8f0',
                borderRadius: 12,
                textAlign: 'center',
                padding: '12px 8px',
                margin: '8px 0'
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 24, color: '#6B8E23', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 600, color: '#6B8E23', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", lineHeight: 1.2 }}>{stats.delivered}</div>
              <div style={{ fontSize: 13, color: '#666', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", marginTop: 4 }}>Delivered</div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]} style={{ marginBottom: 24, margin: '0 0 24px 0' }}>
          <Col xs={24} md={16} style={{ padding: '0 6px', marginBottom: '12px' }}>
            <Input
              size="large"
              placeholder="Search by order number or product name"
              prefix={<SearchOutlined style={{ color: '#8E6A4E' }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ 
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", 
                borderRadius: 8,
                borderColor: '#e8e8e8'
              }}
            />
          </Col>
          <Col xs={24} md={8} style={{ padding: '0 6px' }}>
            <Select
              size="large"
              style={{ 
                width: '100%', 
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
              }}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="ALL">All Orders</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="PROCESSING">Processing</Option>
              <Option value="SHIPPED">Shipped</Option>
              <Option value="DELIVERED">Delivered</Option>
              <Option value="CANCELLED">Cancelled</Option>
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px', borderRadius: 12, border: '1px solid #e8e8e8' }}>
            <Empty description={<span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: '#999' }}>No orders found</span>} />
          </Card>
        ) : (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {filteredOrders.map((order) => (
              <Card 
                key={order._id} 
                bordered={false}
                hoverable
                onClick={() => navigate(`/account/orders/${order._id}`)}
                style={{ 
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <Row gutter={[16, 16]} align="middle" style={{ margin: 0 }}>
                  <Col xs={24} sm={16} md={14} style={{ padding: '8px' }}>
                    <Row gutter={16} align="middle" style={{ margin: 0 }}>
                      <Col xs={8} sm={6} md={5} style={{ padding: '0 8px' }}>
                        <img
                          src={order.items?.[0]?.image ? 
                            `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${order.items[0].image}` : 
                            'https://via.placeholder.com/100'
                          }
                          alt="Product"
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                      </Col>
                      <Col xs={16} sm={18} md={19} style={{ padding: '0 8px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 6, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          {order.items?.[0]?.name || 'Product Name'}
                          {order.items?.length > 1 && <span style={{ fontSize: 13, fontWeight: 400, color: '#999', marginLeft: 6 }}>+{order.items.length - 1} more</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#666', marginBottom: 4, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                        </div>
                        <div style={{ fontSize: 12, color: '#999', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                          {new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} sm={8} md={5} style={{ padding: '8px', marginTop: '8px' }}>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: 20,
                      background: getStatusColor(order.status),
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
                    }}>
                      {order.status}
                    </div>
                  </Col>
                  <Col xs={12} sm={24} md={5} style={{ textAlign: 'right', padding: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </AccountContent>
    </AccountLayout>
  );
};

export default MyOrders;
