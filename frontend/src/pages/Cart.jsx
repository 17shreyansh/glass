import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Button,
  InputNumber,
  Divider,
  Empty,
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const CartCheckout = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, addToCart } = useCart();
  const [variantSelections, setVariantSelections] = useState({});

  const subtotal = getCartTotal();
  const total = subtotal;

  // Check if any item needs variant selection
  const needsVariantSelection = cartItems.some(item => 
    item.variants && item.variants.length > 0 && (!item.size || !item.color)
  );

  const handleVariantChange = (itemIndex, type, value) => {
    const item = cartItems[itemIndex];
    const newSelections = {
      ...variantSelections[itemIndex],
      [type]: value
    };
    setVariantSelections(prev => ({
      ...prev,
      [itemIndex]: newSelections
    }));
    
    // Update cart item with new variant
    const newSize = type === 'size' ? value : (newSelections.size || item.size);
    const newColor = type === 'color' ? value : (newSelections.color || item.color);
    
    // Remove old item and add with new variant
    if (newSize && newColor) {
      removeFromCart(item._id, item.size, item.color);
      setTimeout(() => {
        const updatedItem = { ...item, size: newSize, color: newColor };
        for (let i = 0; i < item.quantity; i++) {
          addToCart(updatedItem, newSize, newColor);
        }
      }, 100);
    }
  };

  const getImageUrl = (item) => {
    const imageUrl = item.image || item.mainImage;
    if (!imageUrl) return 'https://via.placeholder.com/80';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  if (cartItems.length === 0) {
    return (
      <Layout style={{ background: "#fff", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 80 }}>
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#8E6A4E' }} />}
          description="Your cart is empty"
        >
          <Link to="/shop">
            <Button type="primary" style={{ background: '#8E6A4E', borderColor: '#8E6A4E' }}>
              Continue Shopping
            </Button>
          </Link>
        </Empty>
      </Layout>
    );
  }

  const styles = {
    page: { marginTop: 80, padding: "20px 5%", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", background: "#fff", minHeight: '80vh' },
    card: {
      borderRadius: 10,
      border: "1px solid #ddd",
      padding: 20,
      background: "#fff",
      marginBottom: 16
    },
    summaryCard: {
      borderRadius: 8,
      border: "1px solid #ddd",
      background: "#fff",
      padding: "20px",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
      fontSize: 15,
    },
    divider: { margin: "8px 0" },
  };

  return (
    <Layout style={{ background: "#fff", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
      <div style={styles.page}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          Shopping Cart
        </Title>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            {cartItems.map((item, i) => {
              const hasVariants = item.variants && item.variants.length > 0;
              const needsSelection = hasVariants && (!item.size || !item.color);
              
              // Get available attributes
              let availableSizes = [];
              let availableColors = [];
              if (hasVariants) {
                const sizeSet = new Set();
                const colorSet = new Set();
                item.variants.forEach(v => {
                  const attrs = v.attributes || {};
                  if (attrs.Size || attrs.size) sizeSet.add(attrs.Size || attrs.size);
                  if (attrs.Color || attrs.color) colorSet.add(attrs.Color || attrs.color);
                });
                availableSizes = Array.from(sizeSet);
                availableColors = Array.from(colorSet);
              }
              
              return (
              <Card key={`${item._id}-${i}`} style={styles.card}>
                <Row align="middle" gutter={[8, 16]}>
                  <Col xs={6} sm={4}>
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col xs={18} sm={10}>
                    <Title level={5} style={{ marginBottom: 0, fontSize: '16px' }}>
                      {item.name}
                    </Title>
                    
                    {needsSelection ? (
                      <div style={{ marginTop: 8 }}>
                        <Text type="warning" style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>
                          ⚠️ Please select variant
                        </Text>
                        {availableSizes.length > 0 && (
                          <Select
                            placeholder="Select Size"
                            style={{ width: '100%', marginBottom: 4 }}
                            size="small"
                            value={variantSelections[i]?.size || item.size}
                            onChange={(val) => handleVariantChange(i, 'size', val)}
                          >
                            {availableSizes.map(s => <Option key={s} value={s}>{s}</Option>)}
                          </Select>
                        )}
                        {availableColors.length > 0 && (
                          <Select
                            placeholder="Select Color"
                            style={{ width: '100%' }}
                            size="small"
                            value={variantSelections[i]?.color || item.color}
                            onChange={(val) => handleVariantChange(i, 'color', val)}
                          >
                            {availableColors.map(c => <Option key={c} value={c}>{c}</Option>)}
                          </Select>
                        )}
                      </div>
                    ) : (
                      (item.size || item.color) && (
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </Text>
                      )
                    )}
                    <br />
                    <Text strong>₹{item.price}</Text>
                  </Col>
                  <Col xs={12} sm={4} style={{ textAlign: "center" }}>
                    <Text style={{ display: 'block', marginBottom: 8, fontSize: '12px' }}>Quantity</Text>
                    <InputNumber 
                      min={1} 
                      max={10} 
                      value={item.quantity || 1}
                      onChange={(value) => updateQuantity(item._id || item.id, value, item.size, item.color)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={12} sm={6} style={{ textAlign: "right" }}>
                    <Text strong style={{ fontSize: 16 }}>₹{(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                    <br />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      style={{ marginTop: 5 }}
                      onClick={() => removeFromCart(item._id || item.id, item.size, item.color)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card>
            )})}}
          </Col>

          <Col xs={24} lg={8}>
            <Card style={styles.summaryCard}>
              <Title level={4} style={{ marginBottom: 20 }}>Order Summary</Title>
              <div style={styles.summaryRow}>
                <span>Subtotal ({cartItems.length} items):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Divider style={styles.divider} />
              <div style={styles.summaryRow}>
                <span>Shipping:</span>
                <span style={{ color: '#52c41a' }}>FREE</span>
              </div>
              <Divider style={styles.divider} />
              <div
                style={{
                  ...styles.summaryRow,
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#000",
                  marginTop: 10
                }}
              >
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </Card>

            <Link to="/checkout">
              <Button
                type="primary"
                block
                size="large"
                disabled={needsVariantSelection}
                style={{
                  background: needsVariantSelection ? "#ccc" : "#8E6A4E",
                  borderColor: needsVariantSelection ? "#ccc" : "#8E6A4E",
                  marginTop: 20,
                  height: 50,
                  fontSize: 16,
                  fontWeight: 600
                }}
                onClick={() => {
                  if (needsVariantSelection) {
                    message.warning('Please select variants for all items');
                  }
                }}
              >
                {needsVariantSelection ? 'SELECT VARIANTS TO PROCEED' : 'PROCEED TO CHECKOUT'}
              </Button>
            </Link>

            <div style={{ marginTop: 20, textAlign: "center", padding: '15px', background: '#f5f5f5', borderRadius: 8 }}>
              <Text style={{ color: "#666", fontSize: 13 }}>🔒 Secure Payment via Razorpay</Text>
              <br />
              <Text style={{ color: "#999", fontSize: 12 }}>
                UPI • Cards • Net Banking
              </Text>
            </div>

            <Link to="/shop">
              <Button
                block
                style={{
                  marginTop: 15,
                  height: 40,
                  borderColor: '#8E6A4E',
                  color: '#8E6A4E'
                }}
              >
                Continue Shopping
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default CartCheckout;
