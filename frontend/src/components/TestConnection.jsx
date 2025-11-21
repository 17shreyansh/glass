import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Text } = Typography;

const TestConnection = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Testing connection...');

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing connection...');
    
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage(`Backend connected: ${data.message}`);
      } else {
        setStatus('error');
        setMessage('Backend responded with error');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Connection failed: ${error.message}`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getAlertType = () => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'success': return <CheckCircleOutlined />;
      case 'error': return <CloseCircleOutlined />;
      default: return <ReloadOutlined spin />;
    }
  };

  return (
    <Card style={{ margin: '20px 0' }}>
      <Title level={4}>Backend Connection Status</Title>
      <Alert
        message={message}
        type={getAlertType()}
        icon={getIcon()}
        showIcon
        style={{ marginBottom: '16px' }}
      />
      <Button onClick={testConnection} loading={status === 'loading'}>
        Test Connection
      </Button>
      <div style={{ marginTop: '16px' }}>
        <Text type="secondary">
          Backend URL: http://localhost:3001/api
        </Text>
      </div>
    </Card>
  );
};

export default TestConnection;