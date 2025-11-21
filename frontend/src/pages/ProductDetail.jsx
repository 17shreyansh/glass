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
} from 'antd';

// Add Google Font
if (!document.querySelector('link[href*="Josefin+Sans"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap';
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
  const [selectedSize, setSelectedSize] = useState('1');
  const [mainImage, setMainImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [productImages, setProductImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setProductLoading(true);
      try {
        const response = await apiService.getProduct(slug);
        setProduct(response.data);
        
        // Fetch related products
        const relatedResponse = await apiService.getRelatedProducts(slug);
        setRelatedProducts(relatedResponse.data || []);
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
  }, [slug]);

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
                { title: <Link to={`/${product.productType}`}>{product.productType === 'ashta-dhatu' ? 'Ashta Dhatu' : 'Fashion Jewellery'}</Link> },
                { title: product.name }
              ]}
            />
          )}

          <Row gutter={isMobile ? [0, 0] : [40, 40]}>
            {/* Image Section */}
            <Col xs={24} md={12}>
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
                    background: '#f8f9fa'
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

            {/* Product Info */}
            <Col xs={24} md={12}>
              <div style={{ 
                maxWidth: isMobile ? '100%' : 520,
                padding: isMobile ? '20px 16px' : 0
              }}>
                <Title level={3} style={{ 
                  marginBottom: 6,
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: '#8E6A4E'
                }}>
                  {product.name}
                </Title>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Rate disabled value={product.rating || 4} />
                  <Text type="secondary">({product.reviews || 799})</Text>
                </div>

                {/* Price Section */}
                <div style={{ marginTop: 16 }}>
                  {/* Main Price Row */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: 'wrap'
                  }}>
                    <Title level={2} style={{ 
                      color: '#8E6A4E', 
                      margin: 0,
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: isMobile ? '28px' : '32px'
                    }}>
                      ₹{product.price.toLocaleString()}
                    </Title>
                    
                    {product.originalPrice && (
                      <Text delete style={{ 
                        color: '#9a9a9a', 
                        fontSize: isMobile ? '16px' : '18px',
                        fontFamily: "'Josefin Sans', sans-serif"
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
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontWeight: 600
                      }}>
                        {percentSave}% OFF
                      </div>
                    )}
                  </div>

                  {/* EMI and Tax Info */}
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ 
                      display: 'block',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '14px',
                      marginBottom: 4
                    }}>
                      Or 3 interest free payments of ₹{Math.round(product.price / 3)}
                    </Text>
                    <Text type="secondary" style={{ 
                      display: 'block',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '14px'
                    }}>
                      Inclusive of all taxes
                    </Text>
                  </div>


                </div>

                {/* SKU and Size Row */}
                <div style={{ 
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Text type="secondary" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                    SKU: {product.sku || 'N/A'}
                  </Text>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ 
                      fontFamily: "'Josefin Sans', sans-serif",
                      color: '#003333'
                    }}>
                      Size:
                    </Text>
                    <Select
                      value={selectedSize}
                      onChange={(val) => setSelectedSize(val)}
                      style={{ width: 80 }}
                      size="small"
                    >
                      {product.sizeVariants && product.sizeVariants.length > 0 ? (
                        product.sizeVariants.map(variant => (
                          <Option key={variant.size} value={variant.size}>
                            {variant.size}
                          </Option>
                        ))
                      ) : (
                        <Option value="1">1</Option>
                      )}
                    </Select>
                  </div>
                </div>



                {/* In stock info */}
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 16 : 0 }}>
                    <InboxOutlined style={{ color: '#8E6A4E' }} />
                    <Text style={{ fontFamily: "'Josefin Sans', sans-serif" }}>In stock - ready to ship</Text>
                  </div>
                </div>

                {/* Mobile: Color and Quantity in same row */}
                {isMobile ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: 8
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong style={{ 
                        fontFamily: "'Josefin Sans', sans-serif",
                        color: '#8E6A4E'
                      }}>Color:</Text>
                      {product.availableColors && product.availableColors.length > 0 ? (
                        product.availableColors.map((color, index) => (
                          <div
                            key={index}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: color.toLowerCase(),
                              border: index === 0 ? '2px solid #8E6A4E' : '1px solid #ddd',
                              cursor: 'pointer'
                            }}
                          />
                        ))
                      ) : (
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#d4af37',
                            border: '2px solid #0d4b4b',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong style={{ 
                        color: '#8E6A4E',
                        fontFamily: "'Josefin Sans', sans-serif"
                      }}>Qty:</Text>
                      <InputNumber
                        min={1}
                        max={10}
                        value={quantity}
                        onChange={(val) => setQuantity(val)}
                        style={{ 
                          width: 70, 
                          borderRadius: 6,
                          borderColor: '#0d4b4b'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Desktop: Color section */
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                    <Text strong style={{ 
                      fontFamily: "'Josefin Sans', sans-serif",
                      color: '#8E6A4E'
                    }}>Color</Text>
                    {product.availableColors && product.availableColors.length > 0 ? (
                      product.availableColors.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: color.toLowerCase(),
                            border: index === 0 ? '2px solid #8E6A4E' : '1px solid #ddd',
                            cursor: 'pointer'
                          }}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: '#d4af37',
                          border: '2px solid #0d4b4b',
                          cursor: 'pointer'
                        }}
                      />
                    )}
                  </div>
                )}

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
                          background: '#8E6A4E',
                          borderColor: '#8E6A4E',
                          borderRadius: 6,
                          padding: '0 30px',
                          height: 44,
                          fontWeight: 500,
                          fontFamily: "'Josefin Sans', sans-serif",
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong style={{ 
                          color: '#8E6A4E',
                          fontFamily: "'Josefin Sans', sans-serif"
                        }}>Qty:</Text>
                        <InputNumber
                          min={1}
                          max={10}
                          value={quantity}
                          onChange={(val) => setQuantity(val)}
                          style={{ 
                            width: 70, 
                            borderRadius: 6,
                            borderColor: '#8E6A4E'
                          }}
                        />
                      </div>
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
                          fontFamily: "'Josefin Sans', sans-serif",
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

                {/* Enhanced Collapsible sections */}
                <Collapse 
                  bordered={false} 
                  defaultActiveKey={['1']}
                  style={{ background: 'transparent' }}
                  expandIconPosition="end"
                  items={[
                    {
                      key: '1',
                      label: <Text strong style={{ fontSize: '16px', color: '#000000', fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400 }}>DESCRIPTION</Text>,
                      children: <Paragraph style={{ margin: 0, color: '#666', lineHeight: 1.6, fontFamily: "'Josefin Sans', sans-serif", fontSize: '15px' }}>{product.description}</Paragraph>,
                      style: { border: 'none', marginBottom: 8, background: '#f8f9fa', borderRadius: 8 }
                    },
                    {
                      key: '2',
                      label: <Text strong style={{ fontSize: '16px', color: '#000000', fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400 }}>METAL DETAILS</Text>,
                      children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {product.metalDetails && product.metalDetails.length > 0 ? (
                            product.metalDetails.map((detail, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d4b4b' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>{detail}</Text>
                              </div>
                            ))
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8E6A4E' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>Ashta Dhatu alloy base</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8E6A4E' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>Precise gold plating</Text>
                              </div>
                            </>
                          )}
                        </div>
                      ),
                      style: { border: 'none', marginBottom: 8, background: '#f8f9fa', borderRadius: 8 }
                    },
                    {
                      key: '3',
                      label: <Text strong style={{ fontSize: '16px', color: '#000000', fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400 }}>BENEFITS</Text>,
                      children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {product.benefits && product.benefits.length > 0 ? (
                            product.benefits.map((benefit, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircleFilled style={{ color: '#0d4b4b', fontSize: '14px' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>{benefit}</Text>
                              </div>
                            ))
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircleFilled style={{ color: '#8E6A4E', fontSize: '14px' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>Hypoallergenic & skin-friendly</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircleFilled style={{ color: '#8E6A4E', fontSize: '14px' }} />
                                <Text style={{ fontFamily: "'Josefin Sans', sans-serif", color: '#666' }}>Durable & long-lasting finish</Text>
                              </div>
                            </>
                          )}
                        </div>
                      ),
                      style: { border: 'none', background: '#f8f9fa', borderRadius: 8 }
                    }
                  ]}
                />
              </div>
            </Col>
          </Row>

          {/* Reviews section */}
          <div style={{ 
            marginTop: isMobile ? 30 : 60,
            padding: isMobile ? '0 16px' : 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Title level={3} style={{ 
                  margin: 0,
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: '#8E6A4E'
                }}>
                  Reviews
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Rate disabled defaultValue={4} />
                  <Text type="secondary" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>(799)</Text>
                </div>
              </div>

              <Button type="default" style={{ 
                borderRadius: 6,
                borderColor: '#8E6A4E',
                color: '#8E6A4E',
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 500
              }}>
                Write a Review
              </Button>
            </div>

            <Row gutter={[20, 20]} style={{ marginTop: 18 }}>
              {[1, 2, 3, 4].map((n) => (
                <Col xs={24} sm={12} md={6} key={n}>
                  <Card styles={{ body: { padding: 16 } }} style={{ borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar>{'D'}</Avatar>
                      <div>
                        <Text strong>Deepika</Text>
                        <div>
                          <Rate disabled defaultValue={4} style={{ fontSize: 12 }} />
                        </div>
                      </div>
                    </div>
                    <Paragraph style={{ marginTop: 12, marginBottom: 8 }}>its worth it</Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      08/09/2025
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>

            <div style={{ marginTop: 12 }}>
              <a href="#see-more" style={{ color: '#003f3a' }}>
                See More Reviews
              </a>
            </div>
          </div>

          {/* Related Products / Complete Your Style */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div style={{ 
              marginTop: isMobile ? 40 : 70,
              padding: isMobile ? '0 16px' : 0
            }}>
              <Title level={3} style={{ 
                textAlign: 'center', 
                marginBottom: 24,
                fontFamily: "'Josefin Sans', sans-serif",
                color: '#8E6A4E'
              }}>
                Complete Your Style
              </Title>

              <Row gutter={[24, 24]}>
                {relatedProducts.slice(0, 4).map((rp) => (
                  <Col xs={24} sm={12} md={6} key={rp.id}>
                    <ProductCard product={rp} />
                  </Col>
                ))}
              </Row>
            </div>
          )}

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
              background: '#8E6A4E',
              borderColor: '#8E6A4E',
              borderRadius: 8,
              height: 50,
              fontWeight: 600,
              fontFamily: "'Josefin Sans', sans-serif",
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
              fontFamily: "'Josefin Sans', sans-serif",
              flex: 1,
              fontSize: '16px'
            }}
          >
            BUY NOW
          </Button>
        </div>
      )}

      {/* Banner: Adorn Yourself with Timeless Beauty - Full Width */}
      <div
        style={{
          height: isMobile ? 200 : 320,
          display: 'flex',
          alignItems: 'center',
          marginTop: isMobile ? 20 : 0
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${pg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 64,
            }}
          >
            <div style={{ padding: isMobile ? '0 20px' : '0' }}>
              <Title style={{ 
                color: '#fff', 
                margin: 0, 
                fontWeight: 400, 
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: isMobile ? 'clamp(20px, 6vw, 28px)' : 'clamp(28px, 4vw, 42px)',
                textAlign: isMobile ? 'center' : 'left'
              }} level={1}>
                Adorn Yourself with Timeless Beauty
              </Title>
            </div>
          </div>
        </div>
      </div>
      <WebsiteFooter />
    </Layout>
  );
};

export default ProductDetail;
