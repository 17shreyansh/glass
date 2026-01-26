import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/auth.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, values);
            setEmailSent(true);
            message.success('Password reset email sent! Please check your inbox.');
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FAF7EF 0%, #F5F1EB 100%)',
                padding: '20px'
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <Card style={{ 
                        boxShadow: '0 10px 40px rgba(89, 65, 49, 0.08)',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '50px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📧</div>
                        <Title level={2} style={{ 
                            color: '#594131',
                            fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
                            marginBottom: '16px'
                        }}>
                            Check Your Email
                        </Title>
                        <Text style={{ 
                            color: '#666',
                            fontSize: '16px',
                            fontFamily: "'HK Grotesk', sans-serif",
                            display: 'block',
                            marginBottom: '30px'
                        }}>
                            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                        </Text>
                        <Button 
                            type="primary"
                            onClick={() => navigate('/login')}
                            style={{ 
                                background: '#594131',
                                borderColor: '#594131',
                                height: '50px',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontFamily: "'HK Grotesk', sans-serif",
                                fontWeight: 600,
                                width: '100%'
                            }}
                        >
                            Back to Login
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

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
            <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px'
            }}>
                <img src={logo} alt="MV Crafted" style={{ height: '45px' }} />
            </div>
            
            <Button 
                type="text" 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/login')}
                style={{ 
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    color: '#8E6A4E',
                    fontFamily: "'HK Grotesk', sans-serif",
                    fontSize: '14px'
                }}
            >
                Back to Login
            </Button>

            <div style={{ width: '100%', maxWidth: '440px' }}>
                <Card 
                    styles={{ body: { padding: '50px' } }}
                    style={{ 
                        boxShadow: '0 10px 40px rgba(89, 65, 49, 0.08)',
                        border: 'none',
                        borderRadius: '16px',
                        background: 'white'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <Title level={1} style={{ 
                            color: '#594131',
                            fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
                            fontWeight: 400,
                            marginBottom: '12px',
                            fontSize: '36px'
                        }}>
                            Forgot Password?
                        </Title>
                        <Text style={{ 
                            color: '#8E6A4E',
                            fontSize: '16px',
                            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
                        }}>
                            Enter your email to receive a reset link
                        </Text>
                    </div>

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

                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                block
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
                                Send Reset Link
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Text style={{ 
                            color: '#666',
                            fontFamily: "'HK Grotesk', sans-serif",
                            fontSize: '15px'
                        }}>
                            Remember your password?{' '}
                            <Link 
                                to="/login"
                                style={{ 
                                    color: '#594131',
                                    fontFamily: "'HK Grotesk', sans-serif",
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                }}
                            >
                                Sign In
                            </Link>
                        </Text>
                    </div>
                </Card>
                
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

export default ForgotPassword;
