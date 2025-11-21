import React, { useState, useEffect } from 'react';
import { Typography, Breadcrumb, Row, Col, Dropdown, Button, Spin } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { ProductList } from '../components/product';
import { Footer } from '../components/layout';
import { Offer } from '../components';
import apiService from '../services/api';
import hero1 from '../assets/jewelleryImage.jpg';

const { Title } = Typography;

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await apiService.getProducts({ category: slug });
        setProducts(response.data || []);
        
        const categoriesResponse = await apiService.getCategories();
        const foundCategory = categoriesResponse.data?.find(cat => cat.slug === slug);
        setCategory(foundCategory);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [slug]);

  return (
    <div>
      <div 
        style={{
          backgroundImage: `url(${hero1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)'
        }} />
      </div>

      <div style={{ padding: '40px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', fontFamily: "'Prata', serif", color: "#8E6A4E", fontWeight: '400' }}>
          {category?.name || 'Category'}
        </Title>
        <Breadcrumb style={{ marginBottom: '20px', fontFamily: "'Josefin Sans', sans-serif", justifyContent: 'center', display: 'flex' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/shop">Shop</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{category?.name || 'Category'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>

      <Offer />
      <Footer />
    </div>
  );
};

export default Category;