import React from 'react';
import { Card, Typography, Divider, Space, Button } from 'antd';
import { useCart } from '../../context/CartContext';

const { Title, Text } = Typography;

const CartSummary = ({ showCheckoutButton = true, onCheckout }) => {
  const { cartItems, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <Card title="Order Summary" style={{ width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Subtotal ({cartItems.length} items)</Text>
          <Text>₹{subtotal.toLocaleString()}</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Tax (GST 18%)</Text>
          <Text>₹{tax.toFixed(2)}</Text>
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>Total</Title>
          <Title level={4} style={{ margin: 0, color: '#667eea' }}>
            ₹{total.toLocaleString()}
          </Title>
        </div>
        
        {showCheckoutButton && (
          <Button 
            type="primary" 
            size="large" 
            block
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default CartSummary;