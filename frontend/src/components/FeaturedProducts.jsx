import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import { ProductCard } from './product';
import apiService from '../services/api';

const { Title } = Typography;

const FeaturedProducts = ({ limit = 8, skip = 0, title = 'Feature Collection' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiService.getFeaturedProducts(limit, skip);
        const productsData = response?.data || response || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit, skip]);

  return (
    <div style={{
      padding: window.innerWidth <= 768 ? '30px 12px' : '40px 16px',
      backgroundColor: '#fff',
      minHeight: window.innerWidth <= 768 ? 'auto' : '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <Title level={2} style={{
          marginBottom: '32px',
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
          fontWeight: '400',
          color: '#2C200F'
        }}>
          {title}
        </Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p style={{ fontSize: '16px' }}>No featured products available at the moment.</p>
          </div>
        ) : (
          <Row gutter={[20, 24]} justify="center">
            {products.map(product => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                key={product._id}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}

      </div>
    </div>
  );
};

export default FeaturedProducts;