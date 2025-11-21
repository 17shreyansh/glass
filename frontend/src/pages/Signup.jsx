import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Row, Col, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';
import heroImage from '../assets/hero1.jpg';
import '../styles/auth.css';

const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await apiService.register(values);
      message.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "'Josefin Sans', sans-serif"
    }}>
      <Row style={{ minHeight: '100vh' }}>
        {/* Left Side - Image */}
        <Col xs={0} md={12} lg={14} xl={16}
          style={{
            backgroundImage: `linear-gradient(rgba(142, 106, 78, 0.7), rgba(142, 106, 78, 0.7)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative'
          }}
        >
          <div className="auth-hero-content" style={{ textAlign: 'center', padding: '40px' }}>
            <img src={logo} alt="Delicorn" style={{ height: '60px', marginBottom: '30px' }} />
            <Title level={1} className="auth-hero-title" style={{ 
              color: 'white', 
              fontSize: '48px',
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 300,
              marginBottom: '20px'
            }}>
              Join Delicorn
            </Title>
            <Text className="auth-hero-text" style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '18px',
              fontFamily: "'Josefin Sans', sans-serif"
            }}>
              Become part of our exclusive jewelry community and discover handcrafted treasures
            </Text>
            <div className="auth-benefits" style={{ marginTop: '40px', fontSize: '16px' }}>
              <div style={{ marginBottom: '15px' }}>✨ Exclusive member discounts</div>
              <div style={{ marginBottom: '15px' }}>🎁 Early access to new collections</div>
              <div>📦 Free shipping on orders above ₹999</div>
            </div>
          </div>
        </Col>

        {/* Right Side - Form */}
        <Col xs={24} md={12} lg={10} xl={8}
          className="auth-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: '#fafafa'
          }}
        >
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {/* Back Button */}
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              className="auth-back-button"
              style={{ 
                marginBottom: '30px',
                color: '#8E6A4E',
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              Back to Home
            </Button>

            <Card 
              className="auth-card"
              variant="outlined"
              styles={{ body: { padding: '40px' } }}
              style={{ 
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '16px'
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={2} style={{ 
                  color: '#8E6A4E',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 400,
                  marginBottom: '8px'
                }}>
                  Create Account
                </Title>
                <Text style={{ 
                  color: '#666',
                  fontSize: '16px',
                  fontFamily: "'Josefin Sans', sans-serif"
                }}>
                  Join the Delicorn family today
                </Text>
              </div>

              {/* Form */}
              <Form onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Full Name" 
                    className="auth-input"
                    autoComplete="name"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Email Address" 
                    className="auth-input"
                    autoComplete="email"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Phone Number" 
                    className="auth-input"
                    autoComplete="tel"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter your password' },
                    { min: 6, message: 'Password must be at least 6 characters long' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Password" 
                    className="auth-input"
                    autoComplete="new-password"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Confirm Password" 
                    className="auth-input"
                    autoComplete="new-password"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')) }
                  ]}
                >
                  <Checkbox style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                    I agree to the <Link to="/terms" className="auth-link" style={{ color: '#8E6A4E', transition: 'all 0.3s ease' }}>Terms & Conditions</Link> and <Link to="/privacy" className="auth-link" style={{ color: '#8E6A4E', transition: 'all 0.3s ease' }}>Privacy Policy</Link>
                  </Checkbox>
                </Form.Item>

                <Form.Item style={{ marginBottom: '24px' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                    className="auth-button"
                    style={{ 
                      background: '#8E6A4E',
                      borderColor: '#8E6A4E',
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 500,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Create Account
                  </Button>
                </Form.Item>
              </Form>

              <Divider style={{ margin: '24px 0' }} />

              {/* Login Link */}
              <div style={{ textAlign: 'center' }}>
                <Text style={{ 
                  color: '#666',
                  fontFamily: "'Josefin Sans', sans-serif"
                }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login"
                    className="auth-link"
                    style={{ 
                      color: '#8E6A4E',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign In
                  </Link>
                </Text>
              </div>
            </Card>

            {/* Trust Indicators */}
            <div className="trust-indicators" style={{ 
              textAlign: 'center', 
              marginTop: '30px',
              color: '#999',
              fontSize: '14px',
              fontFamily: "'Josefin Sans', sans-serif"
            }}>
              <div style={{ marginBottom: '10px' }}>
                🔒 Your information is secure and encrypted
              </div>
              <div>
                ⭐ Join 4L+ happy customers worldwide
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;