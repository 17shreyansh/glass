import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Footer from '../components/layout/Footer';

const LegalPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLegalPage();
  }, [slug]);

  const fetchLegalPage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/legal/${slug}`);
      setPage(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div style={{ minHeight: '60vh', padding: '40px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page?.title} - MV Crafted</title>
      </Helmet>

      <div style={{ 
        minHeight: '60vh', 
        padding: '60px 20px 80px',
        background: 'linear-gradient(to bottom, #f8f5f0 0%, #ffffff 100%)',
        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif"
      }}>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
            paddingBottom: '30px',
            borderBottom: '2px solid #8E6A4E'
          }}>
            <h1 style={{
              fontSize: window.innerWidth <= 768 ? '32px' : '42px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '15px',
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              letterSpacing: '-0.5px'
            }}>
              {page?.title}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#8E6A4E',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              Last Updated: {new Date(page?.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div 
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: page?.content }}
            style={{
              backgroundColor: 'white',
              padding: window.innerWidth <= 768 ? '30px 20px' : '50px 60px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              lineHeight: '1.8',
              color: '#333'
            }}
          />
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .legal-content h2 {
          font-size: ${window.innerWidth <= 768 ? '24px' : '28px'};
          font-weight: 600;
          margin-top: 40px;
          margin-bottom: 20px;
          color: #1a1a1a;
          font-family: 'HK Grotesk', 'Hanken Grotesk', sans-serif;
          padding-bottom: 10px;
          border-bottom: 1px solid #e8e8e8;
        }
        .legal-content h3 {
          font-size: ${window.innerWidth <= 768 ? '18px' : '20px'};
          font-weight: 600;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #8E6A4E;
          font-family: 'HK Grotesk', 'Hanken Grotesk', sans-serif;
        }
        .legal-content p {
          margin-bottom: 18px;
          font-size: ${window.innerWidth <= 768 ? '15px' : '16px'};
          color: #444;
          line-height: 1.8;
        }
        .legal-content ul, .legal-content ol {
          margin-left: 25px;
          margin-bottom: 18px;
        }
        .legal-content li {
          margin-bottom: 10px;
          font-size: ${window.innerWidth <= 768 ? '15px' : '16px'};
          color: #444;
          line-height: 1.7;
        }
        .legal-content strong {
          color: #1a1a1a;
          font-weight: 600;
        }
        .legal-content a {
          color: #8E6A4E;
          text-decoration: none;
          border-bottom: 1px solid #8E6A4E;
          transition: all 0.3s ease;
        }
        .legal-content a:hover {
          color: #6d5239;
          border-bottom-color: #6d5239;
        }
      `}</style>
    </>
  );
};

export default LegalPage;
