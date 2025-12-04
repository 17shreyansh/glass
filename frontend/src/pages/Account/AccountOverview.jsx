import React, { useState, useEffect } from 'react';
import { Typography, Button, Input, Form, Select, Row, Col, message, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

const { Text } = Typography;
const { Option } = Select;

const AccountOverview = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { user, login } = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getCurrentUser();
        const userData = response.data;
        form.setFieldsValue({
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          gender: userData.gender,
          dob: userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-GB') : ''
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Fallback to user context data
        if (user) {
          form.setFieldsValue({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            gender: user.gender || '',
            dob: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') : ''
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [form, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      const updateData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        dateOfBirth: values.dob ? new Date(values.dob.split('/').reverse().join('-')).toISOString() : null
      };

      const response = await apiService.updateProfile(updateData);
      login(response.data); // Update user context
      message.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  return (
    <AccountLayout title="My Account">
      <AccountContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
          <Text
            style={{
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              color: '#8E6A4E',
            }}
          >
            Profile Details
          </Text>
          {!isEditing ? (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{
                color: '#8E6A4E',
                fontSize: '16px',
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              }}
            >
              Edit
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                style={{
                  background: '#8E6A4E',
                  borderColor: '#8E6A4E',
                  fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                }}
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                style={{
                  fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label={<Text style={{ fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Full Name</Text>}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input
                  disabled={!isEditing}
                  style={{
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                    background: isEditing ? '#fff' : '#f5f5f5',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label={<Text style={{ fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Contact Number</Text>}
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input
                  disabled={!isEditing}
                  style={{
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                    background: isEditing ? '#fff' : '#f5f5f5',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="email"
                label={<Text style={{ fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Email Address</Text>}
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input
                  disabled={!isEditing}
                  style={{
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                    background: isEditing ? '#fff' : '#f5f5f5',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label={<Text style={{ fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Gender</Text>}
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Select
                  disabled={!isEditing}
                  style={{
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                  }}
                >
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dob"
                label={<Text style={{ fontWeight: 600, color: '#8E6A4E', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>Date of Birth</Text>}
                rules={[{ required: true, message: 'Please enter your date of birth' }]}
              >
                <Input
                  disabled={!isEditing}
                  placeholder="DD/MM/YYYY"
                  style={{
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                    background: isEditing ? '#fff' : '#f5f5f5',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
          </>
        )}
      </AccountContent>
    </AccountLayout>
  );
};

export default AccountOverview;



