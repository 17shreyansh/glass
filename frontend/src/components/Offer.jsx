import React from 'react';
import { Button } from 'antd';
import offerImage from '../assets/ear.jpg';

const Offer = () => {
  return (
    <div style={{
      display: 'flex',
      height: '300px',
      backgroundColor: 'black',
      // maxWidth: '1200px',
      margin: '40px auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Right side - Image */}
      <div style={{
        flex: '30%',
        backgroundImage: `url(${offerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      {/* Left side - Text content */}
      <div style={{
        flex: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '100px',
      }}>
        <h2 style={{
          fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
          fontWeight: '600',
          fontSize: '40px',
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
            height: 'auto',
            width: '150px',
          }}
        >
          Shop Now
        </Button>
      </div>
      
      
    </div>
  );
};

export default Offer;
