import React from 'react';
import aboutImage from '../assets/aboutus.jpg'; // adjust the path as needed

const AboutUs = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', color: '#333', lineHeight: '1.8', fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '42px', color: '#8E6A4E', fontFamily: "'Prata', serif", fontWeight: '400' }}>About Us</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px' }}>
        
        {/* Left Side - Image */}
        <div style={{ flex: '1 1 450px', minWidth: '300px' }}>
          <img
            src={aboutImage}
            alt="MV Crafted Impex Glassware"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right Side - Text */}
        <div style={{ flex: '1 1 550px', minWidth: '300px' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            MV CRAFTED IMPEX was founded out of a passion for timeless design and quality craft in glassware. Our roots lie in blending heritage with modern expertise, supplying premium glassware to restaurants, retailers, and gift designers. As entrepreneurs, we believe that every table deserves elegance and every celebration should be unforgettable.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Since our inception, our mission is simple: to design, source, and deliver glassware that elevates everyday moments. With a dedicated team of experts, we bring our customers a blend of innovation and tradition—whether it is classic drinkware or unique statement pieces.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Our commitment to quality, customer satisfaction, and sustainable development has guided our journey. We continue to expand our catalog, setting new standards in design and durability for the glassware industry. Join us as we make moments beautiful, one glass at a time.
          </p>
          <p style={{ fontSize: '16px' }}>
            For more information on our products or to connect with our team, browse our latest collections or reach out directly—we're here to elevate your experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;



