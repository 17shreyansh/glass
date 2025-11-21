import React, { useState, useEffect } from 'react';
import { Typography, Breadcrumb, Row, Col, Dropdown, Button, Spin } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductList } from '../components/product';
import { Footer } from '../components/layout';
import { Offer } from '../components';
import apiService from '../services/api';
import hero1 from '../assets/jewelleryImage.jpg';
import p1 from '../assets/c1.jpg';
import glass from '../assets/glass1.jpg';

const { Title } = Typography;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts({ sortBy: 'featured' });
        const fetchedProducts = response.data || [];
        setAllProducts(fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle URL params for category filtering
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
      filterProducts(category);
    }
  }, [searchParams, allProducts]);

  const filterProducts = (categoryName) => {
    if (categoryName === 'all') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.categories?.some(cat => 
          cat.name?.toLowerCase() === categoryName.toLowerCase()
        )
      );
      setProducts(filtered);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchParams(categoryName === 'all' ? {} : { category: categoryName });
    filterProducts(categoryName);
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        const allCategories = response.data || [];
        setCategories(allCategories.length > 0 ? allCategories : [
          { name: 'Rings', image: p1 },
          { name: 'Pendants', image: p1 },
          { name: 'Bracelets', image: p1 },
          { name: 'Earrings', image: p1 },
          { name: 'Necklaces', image: p1 },
        ]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([
          { name: 'Rings', image: p1 },
          { name: 'Pendants', image: p1 },
          { name: 'Bracelets', image: p1 },
          { name: 'Earrings', image: p1 },
          { name: 'Necklaces', image: p1 },
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Header */}
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

      {/* Heading and Breadcrumb */}
      <div style={{ padding: '40px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', fontFamily: "'Prata', serif", color: "#8E6A4E", fontWeight: '400' }}>
          Jewelry Collection
        </Title>
        <Breadcrumb style={{ marginBottom: '20px', fontFamily: "'Josefin Sans', sans-serif", justifyContent: 'center', display: 'flex' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Shop</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <div 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleCategoryClick('all')}
            >
              <img 
                src={p1}
                alt="All Categories"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '50%',
                  marginBottom: '10px',
                  border: selectedCategory === 'all' ? '3px solid #8E6A4E' : '1px solid #8E6A4E'
                }}
              />
              <Title level={4} style={{ fontFamily: "'Josefin Sans', sans-serif",fontWeight: '500', color: selectedCategory === 'all' ? '#8E6A4E' : '#333' }}>
                All Categories
              </Title>
            </div>
          </Col>
          {categories.map((category, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={4} key={category._id || index}>
              <div 
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <img 
                  src={category.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${category.image}` : p1}
                  alt={category.name}
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '50%',
                    marginBottom: '10px',
                    border: selectedCategory === category.name ? '3px solid #8E6A4E' : '1px solid #8E6A4E'
                  }}
                />
                <Title level={4} style={{ fontFamily: "'Josefin Sans', sans-serif",fontWeight: '500', color: selectedCategory === category.name ? '#8E6A4E' : '#333' }}>
                  {category.name}
                </Title>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Products */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', fontSize: '16px' }}>Filter:</span>
            <Dropdown
              menu={{
                items: [
                  { key: 'all', label: 'All Categories', onClick: () => handleCategoryClick('all') },
                  ...categories.map(cat => ({
                    key: cat.name,
                    label: cat.name,
                    onClick: () => handleCategoryClick(cat.name)
                  })),
                  { key: 'price1', label: 'Price: Under ₹5000' },
                  { key: 'price2', label: 'Price: ₹5000-₹15000' },
                  { key: 'price3', label: 'Price: Above ₹15000' }
                ]
              }}
              trigger={['click']}
            >
              <Button icon={<FilterOutlined />} style={{ fontFamily: "'Josefin Sans', sans-serif", height: '32px', minWidth: '120px' }}>
                {selectedCategory === 'all' ? 'All' : selectedCategory}
              </Button>
            </Dropdown>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', fontSize: '16px' }}>Sort by:</span>
            <Dropdown
              menu={{
                items: [
                  { key: '1', label: 'Featured' },
                  { key: '2', label: 'Price: Low to High' },
                  { key: '3', label: 'Price: High to Low' },
                  { key: '4', label: 'Newest' },
                  { key: '5', label: 'Best Selling' },
                  { key: '6', label: 'Customer Rating' }
                ]
              }}
              trigger={['click']}
            >
              <Button style={{ fontFamily: "'Josefin Sans', sans-serif", height: '32px', minWidth: '120px' }}>
                Featured
              </Button>
            </Dropdown>
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>


      {/* Glass Section */}
      <div style={{ backgroundColor: 'black', padding: 0, margin: 0  }}>
        <img 
          src={glass}
          alt="Glass"
          style={{ 
            height: '600px',
            display: 'block',
            margin: 0
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;