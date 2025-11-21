import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import { ProductCard } from './product';
import apiService from '../services/api';

const { Title } = Typography;

const FeaturedProducts = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiService.getFeaturedProducts(limit);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return (
    <div style={{
      padding: '40px 16px',
      backgroundColor: '#fff',
      minHeight: '100vh'
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
          Feature Collection
        </Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
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