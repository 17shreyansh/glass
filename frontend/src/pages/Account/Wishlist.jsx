import React, { useEffect } from 'react';
import { Row, Col, Typography, Empty, Spin } from 'antd';
import AccountLayout from '../../components/AccountLayout';
import AccountContent from '../../components/AccountContent';
import ProductCard from '../../components/product/ProductCard';
import { useUser } from '../../context/UserContext';
import { HeartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Wishlist = () => {
  const { wishlist, fetchWishlist } = useUser();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      await fetchWishlist();
      setLoading(false);
    };
    loadWishlist();
  }, [fetchWishlist]);

  return (
    <AccountLayout title={`My Wishlist (${wishlist.length} items)`}>
      <AccountContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : wishlist.length === 0 ? (
          <Empty
            image={<HeartOutlined style={{ fontSize: '64px', color: '#114D4D' }} />}
            description="No items in your wishlist"
          />
        ) : (
          <Row gutter={[16, 24]}>
            {wishlist.map(product => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product._id || product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </AccountContent>
    </AccountLayout>
  );
};

export default Wishlist;
