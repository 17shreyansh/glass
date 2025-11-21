import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Row, Col } from 'antd';
import { LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';
import heroImage from '../assets/hero1.jpg';
import '../styles/auth.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiService.login(values);
      login(response.user);
      message.success('Welcome back!');
      navigate('/');
    } catch (error) {
      message.error(error.message || 'Login failed');
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
              Welcome Back
            </Title>
            <Text className="auth-hero-text" style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '18px',
              fontFamily: "'Josefin Sans', sans-serif"
            }}>
              Continue your jewelry journey with Delicorn's exquisite collections
            </Text>
            <div className="auth-benefits" style={{ marginTop: '40px', fontSize: '16px' }}>
              <div style={{ marginBottom: '15px' }}>✨ Access your wishlist</div>
              <div style={{ marginBottom: '15px' }}>📦 Track your orders</div>
              <div>🎁 Exclusive member benefits</div>
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
                  Welcome Back
                </Title>
                <Text style={{ 
                  color: '#666',
                  fontSize: '16px',
                  fontFamily: "'Josefin Sans', sans-serif"
                }}>
                  Sign in to continue your jewelry journey
                </Text>
              </div>

              {/* Form */}
              <Form onFinish={onFinish} layout="vertical" size="large">
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
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter your password' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#8E6A4E' }} />} 
                    placeholder="Password" 
                    className="auth-input"
                    autoComplete="current-password"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  marginBottom: '24px' 
                }}>
                  <Link 
                    to="/forgot-password" 
                    className="auth-link"
                    style={{ 
                      color: '#8E6A4E',
                      fontSize: '14px',
                      fontFamily: "'Josefin Sans', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>

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
                    Sign In
                  </Button>
                </Form.Item>
              </Form>

              <Divider style={{ margin: '24px 0' }} />

              {/* Signup Link */}
              <div style={{ textAlign: 'center' }}>
                <Text style={{ 
                  color: '#666',
                  fontFamily: "'Josefin Sans', sans-serif"
                }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup"
                    className="auth-link"
                    style={{ 
                      color: '#8E6A4E',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign Up
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
                ✨ Join 4L+ happy customers worldwide
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;