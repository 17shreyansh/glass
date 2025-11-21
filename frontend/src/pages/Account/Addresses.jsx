import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Modal, Form, Input, Select, Space, message, Spin, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import apiService from '../../services/api';

const { Text } = Typography;
const { Option } = Select;

const Addresses = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await apiService.request('/user/addresses');
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setIsModalVisible(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await apiService.request(`/user/addresses/${addressId}`, { method: 'DELETE' });
      message.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      message.error('Failed to delete address');
    }
  };

  const handleModalOk = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      if (editingAddress) {
        await apiService.request(`/user/addresses/${editingAddress._id}`, {
          method: 'PUT',
          body: JSON.stringify(values)
        });
        message.success('Address updated successfully');
      } else {
        await apiService.request('/user/addresses', {
          method: 'POST',
          body: JSON.stringify(values)
        });
        message.success('Address added successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchAddresses();
    } catch (error) {
      message.error(error.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <AccountLayout title="Saved Addresses">
      <AccountContent>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddAddress}
          >
            Add New Address
          </Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : addresses.length === 0 ? (
          <Empty description="No addresses found" />
        ) : (
          <Row gutter={[16, 16]}>
            {addresses.map(address => (
              <Col xs={24} lg={12} key={address._id}>
                <Card
                  className="account-card"
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#114D4D' }}>{address.type}</span>
                      {address.isDefault && <Text type="secondary">(Default)</Text>}
                    </div>
                  }
                  extra={
                    <Space>
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleEditAddress(address)} />
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteAddress(address._id)} />
                    </Space>
                  }
                >
                  <Space direction="vertical" size="small">
                    <Text strong>{address.name}</Text>
                    <Text>{address.address}</Text>
                    <Text>{address.city}, {address.state} - {address.pincode}</Text>
                    <Text>Phone: {address.phone}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title={
            <Text style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 600, color: '#114D4D' }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
          confirmLoading={saving}
          okButtonProps={{
            style: {
              background: '#114D4D',
              borderColor: '#114D4D',
              fontFamily: 'Josefin Sans, sans-serif',
            }
          }}
          cancelButtonProps={{
            style: {
              fontFamily: 'Josefin Sans, sans-serif',
            }
          }}
        >
          <Form form={form} layout="vertical" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="type" label="Address Type" rules={[{ required: true }]}>
                  <Select>
                    <Option value="home">Home</Option>
                    <Option value="office">Office</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="state" label="State" rules={[{ required: true }]}>
                  <Select>
                    <Option value="maharashtra">Maharashtra</Option>
                    <Option value="delhi">Delhi</Option>
                    <Option value="karnataka">Karnataka</Option>
                    <Option value="gujarat">Gujarat</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </AccountContent>
    </AccountLayout>
  );
};

export default Addresses;