import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FAF7EF 0%, #F5F1EB 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Logo at top */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px'
      }}>
        <img src={logo} alt="Delicorn" style={{ height: '45px' }} />
      </div>
      
      {/* Back Button */}
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        className="auth-back-button"
        style={{ 
          position: 'absolute',
          top: '30px',
          right: '30px',
          color: '#8E6A4E',
          fontFamily: "'HK Grotesk', sans-serif",
          fontSize: '14px'
        }}
      >
        Back to Home
      </Button>

      <div style={{ width: '100%', maxWidth: '440px' }}>

        <Card 
          className="auth-card"
          styles={{ body: { padding: '50px' } }}
          style={{ 
            boxShadow: '0 10px 40px rgba(89, 65, 49, 0.08)',
            border: 'none',
            borderRadius: '16px',
            background: 'white'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={1} style={{ 
              color: '#594131',
              fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
              fontWeight: 400,
              marginBottom: '12px',
              fontSize: '36px'
            }}>
              Welcome Back
            </Title>
            <Text style={{ 
              color: '#8E6A4E',
              fontSize: '16px',
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
            }}>
              Sign in to continue
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
                  borderRadius: '10px',
                  border: '1px solid #e8e8e8',
                  fontFamily: "'HK Grotesk', sans-serif",
                  height: '50px',
                  fontSize: '15px'
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
                  borderRadius: '10px',
                  border: '1px solid #e8e8e8',
                  fontFamily: "'HK Grotesk', sans-serif",
                  height: '50px',
                  fontSize: '15px'
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
                  fontFamily: "'HK Grotesk', sans-serif"
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
                  background: '#594131',
                  borderColor: '#594131',
                  height: '50px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontFamily: "'HK Grotesk', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '30px 0' }} />

          {/* Signup Link */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: '#666',
              fontFamily: "'HK Grotesk', sans-serif",
              fontSize: '15px'
            }}>
              Don't have an account?{' '}
              <Link 
                to="/signup"
                className="auth-link"
                style={{ 
                  color: '#594131',
                  fontFamily: "'HK Grotesk', sans-serif",
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Sign Up
              </Link>
            </Text>
          </div>
        </Card>
        
        {/* Trust Badge */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          color: '#8E6A4E',
          fontSize: '13px',
          fontFamily: "'HK Grotesk', sans-serif"
        }}>
          🔒 Secure & encrypted connection
        </div>
      </div>
    </div>
  );
};

export default Login;