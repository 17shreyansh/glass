import React, { useState } from 'react';
import { Row, Col, Select, Space, Typography, Pagination } from 'antd';
import ProductCard from './ProductCard';

const { Title } = Typography;
const { Option } = Select;

const ProductList = ({ products, title }) => {
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="product-grid" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {title && (
          <Title level={2} style={{ margin: '0 0 30px 0', textAlign: 'center' }}>
            {title}
          </Title>
        )}

        <Row gutter={[24, 24]}>
          {currentProducts.map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id || product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {products.length > pageSize && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} products`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;