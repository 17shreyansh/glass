import React from 'react';
import { Button } from 'antd';
import offerImage from '../assets/offfer2.jpg';

const Offer2 = () => {
  return (
    <div style={{
      backgroundImage: `url(${offerImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      margin: '40px 0'
    }}>
      {/* Text content */}
      <div style={{
        padding: '40px 60px',
        maxWidth: '600px'
      }}>
        <h2 style={{
          fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
          fontWeight: '600',
          fontSize: '32px',
          color: '#fff',
          marginBottom: '20px',
          lineHeight: '1.4'
        }}>
          Get 10% OFF on your first order when you sign up!
        </h2>
        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: '#8E6A4E',
            borderColor: '#8E6A4E',
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            fontWeight: '600',
            padding: '10px 30px',
            height: 'auto'
          }}
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default Offer2;
