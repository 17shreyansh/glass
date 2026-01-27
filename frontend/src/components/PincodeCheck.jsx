import React, { useState } from 'react';
import { Input, Button, message, Space, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import apiService from '../services/api';

const PincodeCheck = ({ onPincodeVerified }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!pincode || pincode.length !== 6) {
      message.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.checkPincodeServiceability(pincode);
      setResult(response);
      
      if (response.available) {
        message.success('Delivery available to your location!');
        if (onPincodeVerified) {
          onPincodeVerified(pincode, response.couriers);
        }
      } else {
        message.warning('Delivery not available to this pincode');
      }
    } catch (error) {
      message.error('Failed to check serviceability');
      setResult({ available: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          onPressEnter={handleCheck}
        />
        <Button type="primary" onClick={handleCheck} loading={loading}>
          Check
        </Button>
      </Space.Compact>
      
      {result && (
        <div style={{ marginTop: 8 }}>
          {result.available ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Delivery Available
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Not Serviceable
            </Tag>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeCheck;
