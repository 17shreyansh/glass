import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tag, Button, Space, Empty, Spin, Modal, Form, Input, Select, message } from 'antd';
import { UndoOutlined, PlusOutlined } from '@ant-design/icons';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import apiService from '../../services/api';

const { Text } = Typography;
const { Option } = Select;

const ReturnsRefunds = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReturns();
    fetchOrders();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await apiService.getReturns();
      setReturns(response.data || []);
    } catch (error) {
      console.error('Failed to fetch returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleCreateReturn = async () => {
    try {
      const values = await form.validateFields();
      await apiService.createReturn(values);
      message.success('Return request submitted successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchReturns();
    } catch (error) {
      message.error(error.message || 'Failed to create return request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'orange';
      case 'approved': return 'blue';
      case 'rejected': return 'red';
      case 'requested': return 'gold';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'requested': 'Requested',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'processing': 'Processing',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  return (
    <AccountLayout title="Returns & Refunds">
      <AccountContent>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            Request Return
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : returns.length === 0 ? (
          <Empty
            image={<UndoOutlined style={{ fontSize: '64px', color: '#114D4D' }} />}
            description="No returns or refunds"
          />
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {returns.map(returnItem => (
              <Card key={returnItem._id} className="account-card">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={6} sm={4}>
                    <img
                      src={returnItem.product?.mainImage ? 
                        `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${returnItem.product.mainImage}` : 
                        'https://via.placeholder.com/80'
                      }
                      alt="Return Item"
                      style={{ 
                        width: '100%', 
                        maxWidth: '80px',
                        height: '80px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </Col>
                  <Col xs={18} sm={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>{returnItem.product?.name || 'Product'}</Text>
                      <Text type="secondary">Return #{returnItem._id.slice(-8)}</Text>
                      <Text type="secondary">Order #{returnItem.order?.orderNumber || returnItem.order}</Text>
                      <Text type="secondary">Requested on {new Date(returnItem.createdAt).toLocaleDateString()}</Text>
                      <Text>Reason: {returnItem.reason.replace('_', ' ')}</Text>
                      <Tag color={getStatusColor(returnItem.status)}>{getStatusText(returnItem.status)}</Tag>
                    </Space>
                  </Col>
                  <Col xs={12} sm={4} style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '16px' }}>
                      ₹{returnItem.refundAmount?.toLocaleString()}
                    </Text>
                  </Col>
                  <Col xs={12} sm={4} style={{ textAlign: 'right' }}>
                    <Button type="link" style={{ color: '#114D4D' }}>
                      View Details
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}

        <Modal
          title="Request Return/Refund"
          open={isModalVisible}
          onOk={handleCreateReturn}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="orderId" label="Order" rules={[{ required: true }]}>
              <Select placeholder="Select order">
                {orders.map(order => (
                  <Option key={order._id} value={order._id}>
                    Order #{order._id.slice(-8)} - ₹{order.totalAmount}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
              <Select placeholder="Select product">
                {orders.flatMap(order => 
                  order.items?.map(item => (
                    <Option key={item.product?._id || item._id} value={item.product?._id || item._id}>
                      {item.product?.name || item.name}
                    </Option>
                  )) || []
                )}
              </Select>
            </Form.Item>

            <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
              <Select placeholder="Select reason">
                <Option value="defective">Defective Product</Option>
                <Option value="wrong_size">Wrong Size</Option>
                <Option value="wrong_item">Wrong Item</Option>
                <Option value="not_as_described">Not as Described</Option>
                <Option value="damaged">Damaged</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Describe the issue..." />
            </Form.Item>

            <Form.Item name="refundAmount" label="Refund Amount" rules={[{ required: true }]}>
              <Input type="number" prefix="₹" placeholder="Enter refund amount" />
            </Form.Item>
          </Form>
        </Modal>
      </AccountContent>
    </AccountLayout>
  );
};

export default ReturnsRefunds;