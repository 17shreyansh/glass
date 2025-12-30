import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Breadcrumb,
  InputNumber,
  Space,
  Divider,
  Collapse,
  Card,
  Select,
  Avatar,
  Input,
  Modal,
  Form,
  message,
} from 'antd';

// Add Google Font
if (!document.querySelector('link[href*="HK+Grotesk"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=HK+Grotesk:wght@400;500;600&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
import {
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleFilled,
  InboxOutlined,
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../data/products';
import apiService from '../services/api';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ProductCard } from '../components/product';
import { Footer as WebsiteFooter } from '../components/layout';
import pg from '../assets/pg.jpg';
import c1 from '../assets/c1.jpg';
import c2 from '../assets/c2.jpg';
import c3 from '../assets/c3.jpg';
import c4 from '../assets/c4.jpg';
import c5 from '../assets/c5.jpg';
import ring from '../assets/ring.jpg';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [productImages, setProductImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const { isAuthenticated } = useUser();
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setProductLoading(true);
      try {
        const productData = await apiService.getProduct(slug);
        setProduct(productData);
        
        // Fetch related products
        const relatedData = await apiService.getRelatedProducts(slug);
        setRelatedProducts(relatedData || []);
        
        // Fetch reviews
        if (productData._id) {
          fetchReviews(productData._id);
          if (isAuthenticated()) {
            checkCanReview(productData._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // Fallback to static data
        const staticProduct = getProductById(slug);
        setProduct(staticProduct);
        setRelatedProducts(getRelatedProducts(slug, staticProduct?.category) || []);
      } finally {
        setProductLoading(false);
      }
    };
    
    if (slug) {
      fetchProduct();
    }
  }, [slug, isAuthenticated]);

  const fetchReviews = async (productId) => {
    try {
      const response = await apiService.getProductReviews(productId, { limit: 3 });
      if (response.success) {
        setReviews(response.data.reviews || []);
        setReviewStats(response.data.statistics || null);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const checkCanReview = async (productId) => {
    try {
      const response = await apiService.canUserReview(productId);
      if (response.success) {
        setCanReview(response.canReview);
      }
    } catch (error) {
      console.error('Failed to check review eligibility:', error);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated()) {
      message.warning('Please login to write a review');
      return;
    }
    if (!canReview) {
      message.warning('You can only review products you have purchased');
      return;
    }
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    try {
      const values = await reviewForm.validateFields();
      const response = await apiService.createReview(product._id, values);
      if (response.success) {
        message.success('Review submitted successfully');
        setReviewModalVisible(false);
        reviewForm.resetFields();
        fetchReviews(product._id);
        setCanReview(false);
      }
    } catch (error) {
      message.error(error.message || 'Failed to submit review');
    }
  };

  // Initialize images when product loads
  React.useEffect(() => {
    const images = [];
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
    
    if (product) {
      // Add main image
      if (product.mainImage) {
        images.push(`${backendUrl}${product.mainImage}`);
      }
      
      // Add gallery images
      if (product.galleryImages && product.galleryImages.length > 0) {
        product.galleryImages.forEach(img => {
          images.push(`${backendUrl}${img}`);
        });
      }
    }
    
    // Fallback to static images if no product images
    if (images.length === 0) {
      images.push(...[c1, c2, c3, c4, c5, ring]);
    }
    
    setProductImages(images);
    setMainImage(images[0]);
    setCurrentImageIndex(0);
  }, [product]);

  if (productLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div>Loading product...</div>
      </div>
    );
  }

  if (!product) return <div style={{ padding: 40 }}>Product not found</div>;
  
  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % productImages.length;
    setCurrentImageIndex(nextIndex);
    setMainImage(productImages[nextIndex]);
  };
  
  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setMainImage(productImages[prevIndex]);
  };
  
  const selectImage = (index) => {
    setCurrentImageIndex(index);
    setMainImage(productImages[index]);
  };

  const handleAddToCart = () => {
    // add quantity copies to cart
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  // compute percent save (guard divide by zero)
  const percentSave =
    product.originalPrice && product.originalPrice > 0
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <Layout style={{ marginTop: 0, background: '#ffffff' }}>
      <Content style={{ padding: isMobile ? '0' : '30px 48px' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 1200, margin: '0 auto' }}>
          {/* Breadcrumb - Desktop only */}
          {!isMobile && (
            <Breadcrumb 
              style={{ marginBottom: 20 }}
              items={[
                { title: <Link to="/">Home</Link> },
                { title: <Link to="/shop">Shop</Link> },
                { title: product.name }
              ]}
            />
          )}

          <Row gutter={isMobile ? [0, 0] : [40, 40]} style={{ position: 'relative' }}>
            {/* Image Section */}
            <Col xs={24} md={10}>
              <div style={{ 
                position: isMobile ? 'sticky' : 'static',
                top: isMobile ? 0 : 'auto',
                zIndex: isMobile ? 10 : 'auto',
                background: '#fff'
              }}>
                {/* Main Image with arrows */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile ? '100vw' : 480,
                    maxHeight: isMobile ? 400 : 480,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: isMobile ? 0 : 8,
                    background: '#f8f9fa',
                    cursor: !isMobile ? 'crosshair' : 'default'
                  }}
                  onMouseEnter={() => !isMobile && setShowZoom(true)}
                  onMouseLeave={() => !isMobile && setShowZoom(false)}
                  onMouseMove={(e) => {
                    if (!isMobile) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setZoomPosition({ 
                        x: Math.max(20, Math.min(80, x)),
                        y: Math.max(20, Math.min(80, y))
                      });
                    }
                  }}
                >
                  <img
                    src={mainImage}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                  
                  {/* Zoom Lens Indicator */}
                  {!isMobile && showZoom && (
                    <div style={{
                      position: 'absolute',
                      width: '40%',
                      height: '40%',
                      border: '2px solid rgba(142, 106, 78, 0.8)',
                      background: 'rgba(142, 106, 78, 0.1)',
                      pointerEvents: 'none',
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
                      cursor: 'crosshair'
                    }} />
                  )}
                  
                  {/* Left Arrow */}
                  <Button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: isMobile ? 15 : 10,
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: isMobile ? 45 : 40,
                      height: isMobile ? 45 : 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '20px' : '16px'
                    }}
                  >
                    ‹
                  </Button>
                  
                  {/* Right Arrow */}
                  <Button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: isMobile ? 15 : 10,
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: isMobile ? 45 : 40,
                      height: isMobile ? 45 : 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '20px' : '16px'
                    }}
                  >
                    ›
                  </Button>
                </div>

                {/* Dots Navigation */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: isMobile ? 6 : 8, 
                  marginTop: isMobile ? 12 : 16,
                  padding: isMobile ? '0 16px' : 0
                }}>
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => selectImage(index)}
                      style={{
                        width: isMobile ? 8 : 12,
                        height: isMobile ? 8 : 12,
                        borderRadius: '50%',
                        background: currentImageIndex === index ? '#0d4b4b' : '#ddd',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                {/* Thumbnails - Desktop only */}
                {!isMobile && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    marginTop: 16,
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {productImages.map((thumb, i) => (
                      <div
                        key={i}
                        onClick={() => selectImage(i)}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 6,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          opacity: currentImageIndex === i ? 1 : 0.6,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <img
                          src={thumb}
                          alt={`Thumb ${i + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            {/* Product Info and Reviews */}
            <Col xs={24} md={14} style={{ position: 'relative' }}>
              {/* Zoomed Image - Desktop only */}
              {!isMobile && showZoom && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 480,
                  height: 480,
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  background: '#fff',
                  zIndex: 100,
                  pointerEvents: 'none',
                  border: '3px solid #8E6A4E'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${mainImage})`,
                    backgroundSize: '250%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'high-quality'
                  }} />
                </div>
              )}
              <div style={{ 
                padding: isMobile ? '20px 16px' : 0
              }}>
                <Title level={3} style={{ 
                  marginBottom: 6,
                  fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                  color: '#392A21'
                }}>
                  {product.name}
                </Title>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Rate disabled value={reviewStats?.averageRating || product.rating || 4} />
                  <Text type="secondary">({reviewStats?.totalReviews || product.reviewsCount || 0})</Text>
                </div>

                {/* Price Section */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: 'wrap'
                  }}>
                    <Title level={2} style={{ 
                      color: '#000000', 
                      margin: 0,
                      fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                      fontSize: isMobile ? '28px' : '32px'
                    }}>
                      ₹{product.price.toLocaleString()}
                    </Title>
                    
                    {product.originalPrice && (
                      <Text delete style={{ 
                        color: '#9a9a9a', 
                        fontSize: isMobile ? '16px' : '18px',
                        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
                      }}>
                        ₹{product.originalPrice.toLocaleString()}
                      </Text>
                    )}
                    
                    {percentSave > 0 && (
                      <div style={{
                        background: '#8E6A4E',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: isMobile ? '12px' : '14px',
                        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                        fontWeight: 600
                      }}>
                        {percentSave}% OFF
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ 
                      display: 'block',
                      fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                      fontSize: '14px',
                      marginBottom: 4
                    }}>
                      Or 3 interest free payments of ₹{Math.round(product.price / 3)}
                    </Text>
                    <Text type="secondary" style={{ 
                      display: 'block',
                      fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                      fontSize: '14px'
                    }}>
                      Inclusive of all taxes
                    </Text>
                  </div>
                </div>

                {/* SKU */}
                <Text type="secondary" style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", display: 'block', marginTop: 14 }}>
                  SKU: {selectedVariant?.sku || product.sku || 'N/A'}
                </Text>

                {/* Variant Selection - Improved */}
                {product.variants && product.variants.length > 0 && (() => {
                  const attrKeys = new Set();
                  product.variants.forEach(v => {
                    if (v.attributes) {
                      Object.keys(v.attributes).forEach(k => attrKeys.add(k));
                    }
                  });
                  
                  if (attrKeys.size === 0) return null;
                  
                  return (
                    <div style={{ 
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: 8,
                      marginTop: 16
                    }}>
                      <Text strong style={{ 
                        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                        color: '#8E6A4E',
                        display: 'block',
                        marginBottom: 12,
                        fontSize: '15px'
                      }}>Select Options</Text>
                      {Array.from(attrKeys).map(attrKey => {
                        const uniqueValues = [...new Set(product.variants.map(v => v.attributes?.[attrKey]).filter(Boolean))];
                        return (
                          <div key={attrKey} style={{ marginBottom: 12 }}>
                            <Text style={{ 
                              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                              fontSize: '13px',
                              display: 'block',
                              marginBottom: 6,
                              color: '#666'
                            }}>
                              {attrKey}
                            </Text>
                            <Select
                              value={selectedAttributes[attrKey]}
                              onChange={(val) => {
                                const newAttrs = { ...selectedAttributes, [attrKey]: val };
                                setSelectedAttributes(newAttrs);
                                const matchingVariant = product.variants.find(v => 
                                  Object.keys(newAttrs).every(k => v.attributes?.[k] === newAttrs[k])
                                );
                                setSelectedVariant(matchingVariant || null);
                              }}
                              style={{ width: '100%' }}
                              placeholder={`Select ${attrKey}`}
                            >
                              {uniqueValues.map(val => (
                                <Option key={val} value={val}>{val}</Option>
                              ))}
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Stock Info */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InboxOutlined style={{ color: product.inStock ? '#52c41a' : '#ff4d4f' }} />
                    <Text style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: '14px' }}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Text>
                    {selectedVariant && (
                      <Text type="secondary" style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: '13px' }}>
                        - {selectedVariant.stock} available
                      </Text>
                    )}
                    {!selectedVariant && product.totalStock > 0 && (
                      <Text type="secondary" style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: '13px' }}>
                        - {product.totalStock} available
                      </Text>
                    )}
                  </div>
                </div>

                {/* Quantity - Improved */}
                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ 
                    fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: 8,
                    color: '#8E6A4E'
                  }}>Quantity</Text>
                  <InputNumber
                    min={1}
                    max={selectedVariant?.stock || product.totalStock || 10}
                    value={quantity}
                    onChange={(val) => setQuantity(val)}
                    size="large"
                    style={{ 
                      width: isMobile ? '100%' : '150px',
                      borderRadius: 6
                    }}
                  />
                </div>

                {/* Desktop buttons */}
                {!isMobile ? (
                  <>
                    <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        size="large"
                        onClick={handleAddToCart}
                        disabled={!product.isActive || !product.inStock}
                        style={{
                          background: '#000000',
                          borderColor: '#000000',
                          borderRadius: 6,
                          padding: '0 30px',
                          height: 44,
                          fontWeight: 500,
                          fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                          flex: 1
                        }}
                      >
                        ADD TO BAG
                      </Button>

                      <Button
                        size="large"
                        icon={<HeartOutlined />}
                        onClick={handleWishlist}
                        style={{
                          borderRadius: 6,
                          borderColor: isInWishlist(product.id) ? '#ff4d4f' : '#8E6A4E',
                          color: isInWishlist(product.id) ? '#ff4d4f' : '#8E6A4E',
                          height: 44,
                          width: 44,
                          padding: 0
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <Button
                        type="default"
                        size="large"
                        style={{
                          background: '#8E6A4E',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          height: 44,
                          fontWeight: 500,
                          fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                          width: '100%'
                        }}
                      >
                        BUY NOW
                      </Button>
                    </div>
                  </>
                ) : null}

                {/* Mobile: Add bottom padding for fixed buttons */}
                {isMobile && (
                  <div style={{ height: 20 }} />
                )}

                <Divider style={{ marginTop: 20, borderColor: '#f0f0f0' }} />

                {/* Description */}
                {product.description && (
                  <Collapse 
                    bordered={false} 
                    defaultActiveKey={['1']}
                    style={{ background: 'transparent' }}
                    expandIconPosition="end"
                    items={[
                      {
                        key: '1',
                        label: <Text strong style={{ fontSize: '16px', color: '#000000', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontWeight: 400 }}>DESCRIPTION</Text>,
                        children: <Paragraph style={{ margin: 0, color: '#666', lineHeight: 1.6, fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: '15px' }}>{product.description}</Paragraph>,
                        style: { border: 'none', background: '#f8f9fa', borderRadius: 8 }
                      }
                    ]}
                  />
                )}

                {/* Reviews section */}
                <div style={{ marginTop: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Title level={4} style={{ 
                        margin: 0,
                        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                        color: '#8E6A4E'
                      }}>
                        Reviews
                      </Title>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Rate disabled value={reviewStats?.averageRating || 0} style={{ fontSize: 14 }} />
                        <Text type="secondary" style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", fontSize: '13px' }}>({reviewStats?.totalReviews || 0})</Text>
                      </div>
                    </div>

                    <Button 
                      type="default" 
                      size="small" 
                      onClick={handleWriteReview}
                      disabled={!canReview}
                      style={{ 
                        borderRadius: 6,
                        borderColor: '#8E6A4E',
                        color: '#8E6A4E',
                        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                        fontWeight: 500
                      }}
                    >
                      Write Review
                    </Button>
                  </div>

                  {reviews.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {reviews.map((review) => (
                        <Card key={review._id} styles={{ body: { padding: 12 } }} style={{ borderRadius: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar size="small">{review.userId?.name?.[0] || 'U'}</Avatar>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: '13px' }}>{review.userId?.name || 'Anonymous'}</Text>
                                <Rate disabled value={review.rating} style={{ fontSize: 11 }} />
                              </div>
                              <Text strong style={{ display: 'block', margin: '4px 0 2px', fontSize: '12px' }}>{review.title}</Text>
                              <Paragraph style={{ margin: '2px 0 4px', fontSize: '13px', color: '#666' }}>{review.comment}</Paragraph>
                              <Text type="secondary" style={{ fontSize: 11 }}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: 8 }}>
                      <Text type="secondary">No reviews yet. Be the first to review!</Text>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Recommendations - at bottom */}
          <div style={{ 
            marginTop: isMobile ? 40 : 60,
            padding: isMobile ? '0 16px' : 0
          }}>
            <Title level={3} style={{ 
              textAlign: 'center', 
              marginBottom: 30,
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              color: '#8E6A4E'
            }}>
              Recommended For You
            </Title>

            {relatedProducts && relatedProducts.length > 0 ? (
              <Row gutter={[24, 24]}>
                {relatedProducts.slice(0, 4).map((rp) => (
                  <Col xs={24} sm={12} md={6} key={rp.id}>
                    <ProductCard product={rp} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                background: '#f8f9fa',
                borderRadius: 8
              }}>
                <Text type="secondary" style={{ fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
                  No recommendations available at the moment
                </Text>
              </div>
            )}
          </div>

        </div>
      </Content>
      
      {/* Mobile: Fixed bottom buttons */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          padding: '12px 16px',
          borderTop: '1px solid #f0f0f0',
          zIndex: 1000,
          display: 'flex',
          gap: 12
        }}>
          <Button
            size="large"
            icon={<HeartOutlined />}
            onClick={handleWishlist}
            style={{
              borderRadius: 8,
              borderColor: isInWishlist(product.id) ? '#ff4d4f' : '#8E6A4E',
              color: isInWishlist(product.id) ? '#ff4d4f' : '#8E6A4E',
              height: 50,
              width: 50,
              padding: 0
            }}
          />
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{
              background: '#000000',
              borderColor: '#000000',
              borderRadius: 8,
              height: 50,
              fontWeight: 600,
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              flex: 1,
              fontSize: '16px'
            }}
          >
            ADD TO BAG
          </Button>
          <Button
            size="large"
            style={{
              background: '#8E6A4E',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              height: 50,
              fontWeight: 600,
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              flex: 1,
              fontSize: '16px'
            }}
          >
            BUY NOW
          </Button>
        </div>
      )}

      
      <WebsiteFooter />

      {/* Review Modal */}
      <Modal
        title="Write a Review"
        open={reviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => {
          setReviewModalVisible(false);
          reviewForm.resetFields();
        }}
        okText="Submit Review"
        okButtonProps={{
          style: {
            background: '#8E6A4E',
            borderColor: '#8E6A4E',
          }
        }}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please select a rating' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="title"
            label="Review Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Summarize your experience" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Your Review"
            rules={[{ required: true, message: 'Please write your review' }]}
          >
            <Input.TextArea rows={4} placeholder="Share your thoughts about this product" maxLength={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProductDetail;
