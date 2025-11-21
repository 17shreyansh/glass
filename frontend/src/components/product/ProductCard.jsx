import React from 'react';
import { Card, Button, Typography, Space, Rate } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUser();

  // Return null if product is not available
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.slug}`);
  };

  // Calculate discount percentage if originalPrice exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    // Removed Badge.Ribbon wrapper
    <Card
      onClick={handleViewDetails}
      style={{
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto 20px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer'
      }}
      styles={{ body: { padding: '0' } }}
      cover={
        <div style={{ 
          position: 'relative',
          height: '250px',
          overflow: 'hidden'
        }}>
          <img
            alt={product.name}
            src={product.mainImage ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${product.mainImage}` : product.image || '/placeholder-image.jpg'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            cursor: 'pointer',
            // Removed background, border-radius, etc.
          }}>
            <HeartOutlined
              style={{
                color: isInWishlist(product._id) ? '#ff4d4f' : '#333',
                fontSize: '24px',
              }}
              onClick={handleWishlist}
            />
          </div>
        </div>
      }
      // Removed 'actions' prop
    >
      {/* "Add to cart" button moved into the card body, below the image */}
      <div style={{ padding: '12px 16px 0', textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleAddToCart}
          disabled={!product.isActive || !product.inStock}
          style={{
            background: '#8E6A4E',
            borderColor: '#8E6A4E',
            borderRadius: '4px',
            fontSize: '16px',
            height: 'auto',
            padding: '8px 16px',
          }}
        >
          {(product.isActive && product.inStock) ? 'Add to cart' : 'Out of Stock'}
        </Button>
      </div>

      {/* Meta component now has its own padding */}
      <Meta
        style={{ padding: '12px 16px 16px' }}
        title={
          <div>
            <Text strong style={{ fontSize: '20px', color: '#333' }}>
              {product.name}
            </Text>
          </div>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            
            {/* Price Line (matches image) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Text strong style={{ fontSize: '18px', color: '#333' }}>
                ₹{(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              {product.originalPrice && (
                <>
                  <Text delete type="secondary" style={{ fontSize: '16px' }}>
                    ₹{(product.originalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={{ fontSize: '16px', color: '#388e3c' /* Green for discount */ }}>
                    ({discountPercent}%)
                  </Text>
                </>
              )}
            </div>

            {/* Rating Line (matches image) */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rate disabled defaultValue={product.rating} style={{ fontSize: '20px', color: '#fadb14' }} />
                {/* Removed (product.reviews) text */}
              </div>
            )}
            
            {/* External Link (matches image) */}
            <Text style={{ fontSize: '14px', color: '#555', textDecoration: 'underline', cursor: 'pointer' }}>
              Click to buy from Amazon/Flipkart
            </Text>

          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;