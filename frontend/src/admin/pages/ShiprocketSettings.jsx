import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Space, Alert, Switch } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import adminApi from '../../services/adminApi';

const ShiprocketSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const email = await adminApi.getSetting('SHIPROCKET_EMAIL');
      const password = await adminApi.getSetting('SHIPROCKET_PASSWORD');
      const pickupLocation = await adminApi.getSetting('SHIPROCKET_PICKUP_LOCATION');
      const pickupPincode = await adminApi.getSetting('SHIPROCKET_PICKUP_PINCODE');
      const isEnabled = await adminApi.getSetting('SHIPROCKET_ENABLED');
      
      form.setFieldsValue({
        email: email.value,
        password: password.value,
        pickupLocation: pickupLocation.value,
        pickupPincode: pickupPincode.value
      });
      setEnabled(isEnabled.value || false);
    } catch (error) {
      console.error('Fetch settings error:', error);
    }
    setLoading(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await adminApi.saveSetting('SHIPROCKET_EMAIL', values.email);
      await adminApi.saveSetting('SHIPROCKET_PASSWORD', values.password);
      await adminApi.saveSetting('SHIPROCKET_PICKUP_LOCATION', values.pickupLocation);
      await adminApi.saveSetting('SHIPROCKET_PICKUP_PINCODE', values.pickupPincode);
      await adminApi.saveSetting('SHIPROCKET_ENABLED', enabled);
      message.success('Shiprocket settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        Shiprocket Configuration
      </h1>

      <Alert
        message="Shiprocket Integration"
        description="Configure your Shiprocket credentials to enable automated shipping and tracking."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Enable Shiprocket" style={{ marginBottom: '24px' }}>
            <Switch 
              checked={enabled} 
              onChange={setEnabled}
              checkedChildren="Enabled" 
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Shiprocket Email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email!' }]}
          >
            <Input placeholder="your@email.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Shiprocket Password"
            rules={[{ required: true, message: 'Please enter password!' }]}
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>

          <Form.Item
            name="pickupLocation"
            label="Pickup Location Name"
            rules={[{ required: true, message: 'Please enter pickup location!' }]}
          >
            <Input placeholder="Primary" size="large" />
          </Form.Item>

          <Form.Item
            name="pickupPincode"
            label="Pickup Pincode"
            rules={[{ required: true, message: 'Please enter pickup pincode!' }]}
          >
            <Input placeholder="110001" size="large" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Save Configuration
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchSettings}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ShiprocketSettings;
