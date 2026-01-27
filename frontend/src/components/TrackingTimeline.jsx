import React from 'react';
import { Steps, Card, Typography, Tag } from 'antd';
import { 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  RocketOutlined, 
  TruckOutlined,
  HomeOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const TrackingTimeline = ({ order, shippingHistory = [] }) => {
  const getStepStatus = (stepStatus) => {
    const currentStatus = order?.status;
    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) return 'finish';
    if (stepIndex === currentIndex) return 'process';
    return 'wait';
  };

  const steps = [
    {
      title: 'Order Placed',
      status: getStepStatus('PENDING'),
      icon: <ShoppingCartOutlined />,
      description: order?.placedAt ? new Date(order.placedAt).toLocaleDateString() : ''
    },
    {
      title: 'Confirmed',
      status: getStepStatus('CONFIRMED'),
      icon: <CheckCircleOutlined />,
      description: order?.confirmedAt ? new Date(order.confirmedAt).toLocaleDateString() : ''
    },
    {
      title: 'Processing',
      status: getStepStatus('PROCESSING'),
      icon: <RocketOutlined />,
      description: 'Preparing for shipment'
    },
    {
      title: 'Shipped',
      status: getStepStatus('SHIPPED'),
      icon: <TruckOutlined />,
      description: order?.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : ''
    },
    {
      title: 'Delivered',
      status: getStepStatus('DELIVERED'),
      icon: <HomeOutlined />,
      description: order?.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : ''
    }
  ];

  return (
    <Card title="Order Tracking" style={{ marginTop: 16 }}>
      <Steps
        current={steps.findIndex(s => s.status === 'process')}
        items={steps}
        direction="vertical"
      />
      
      {order?.shiprocket?.awbCode && (
        <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Text strong>Tracking Details:</Text>
          <div style={{ marginTop: 8 }}>
            <Text>AWB: {order.shiprocket.awbCode}</Text>
          </div>
          <div>
            <Text>Courier: {order.shiprocket.courierName}</Text>
          </div>
          {order.shiprocket.trackingUrl && (
            <div style={{ marginTop: 8 }}>
              <a href={order.shiprocket.trackingUrl} target="_blank" rel="noopener noreferrer">
                Track on Courier Website
              </a>
            </div>
          )}
        </div>
      )}

      {shippingHistory && shippingHistory.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Text strong>Shipping History:</Text>
          <div style={{ marginTop: 12 }}>
            {shippingHistory.map((event, index) => (
              <div key={index} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color="blue">{event.status}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                </div>
                {event.location && <Text type="secondary">{event.location}</Text>}
                {event.remarks && <div><Text>{event.remarks}</Text></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrackingTimeline;
