import React, { useState, useEffect } from 'react';
import { Typography, Breadcrumb, Row, Col, Select, Spin, Empty, Button, Space } from 'antd';
import { FilterOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProductCard from './product/ProductCard';
import { Footer } from './layout';
import apiService from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const CategoryPage = ({ 
  categorySlug, 
  categoryName, 
  heroImage, 
  breadcrumbItems = [],
  filters = {},
  showFilters = true,
  pageSize = 12 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, sortBy, JSON.stringify(filters)]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        ...(categorySlug && { category: categorySlug }),
        sort: sortBy
      };
      console.log('Fetching products with params:', queryParams);
      
      const response = await apiService.getProducts(queryParams);
      console.log('API Response:', response);
      const productsData = Array.isArray(response) ? response : (response.data || []);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  const defaultBreadcrumbs = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to="/shop">Shop</Link> },
    { title: categoryName }
  ];

  const breadcrumbs = breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumbs;

  return (
    <div>
      {/* Hero Section */}
      {heroImage ? (
        <div 
          style={{
            backgroundImage: `url(${heroImage})`,
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
      ) : (
        <div 
          style={{
            backgroundColor: '#f5f5f5',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '2px dashed #d9d9d9'
          }}
        >
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
            <div style={{ fontSize: '16px' }}>No Banner Image</div>
          </div>
        </div>
      )}

      {/* Heading and Breadcrumb */}
      <div style={{ padding: '40px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', fontFamily: "'Prata', serif", color: "#8E6A4E", fontWeight: '400' }}>
          {categoryName}
        </Title>
        <Breadcrumb 
          items={breadcrumbs}
          style={{ 
            marginBottom: '20px', 
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", 
            justifyContent: 'center', 
            display: 'flex' 
          }}
        />
      </div>

      {/* Products Section */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontWeight: '500', fontSize: '16px' }}>Filter:</span>
            {showFilters && (
              <Button icon={<FilterOutlined />} style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", height: '32px', minWidth: '120px' }}>
                All
              </Button>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontWeight: '500', fontSize: '16px' }}>Sort by:</span>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 150, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}
              placeholder="Sort by"
            >
              <Option value="name">Featured</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
              <Option value="newest">Newest</Option>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty 
            description="No products found"
            style={{ padding: '50px 0' }}
          />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {currentProducts.map(product => (
                <Col 
                  xs={24} 
                  sm={viewMode === 'list' ? 24 : 12} 
                  md={viewMode === 'list' ? 24 : 8} 
                  lg={viewMode === 'list' ? 24 : 6} 
                  key={product._id || product.id}
                >
                  <ProductCard product={product} layout={viewMode} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {products.length > pageSize && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Button.Group>
                  {Array.from({ length: Math.ceil(products.length / pageSize) }, (_, i) => (
                    <Button
                      key={i + 1}
                      type={currentPage === i + 1 ? 'primary' : 'default'}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </Button.Group>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;