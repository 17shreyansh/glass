import React from 'react';
import { Card } from 'antd';

const AccountContent = ({ children, className = '' }) => {
  return (
    <Card
      bordered={false}
      className={`account-content ${className}`}
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: 'none',
        minHeight: '500px',
      }}
    >
      {children}
    </Card>
  );
};

export default AccountContent;