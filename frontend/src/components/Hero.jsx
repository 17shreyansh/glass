import React from 'react';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import image from '../assets/hero1.jpg';

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 90px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
        }}
      >
        {/* Dark overlay for cinematic effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Title
            level={1}
            style={{
              color: "white",
              fontSize: "clamp(34px, 5vw, 62px)",
              marginBottom: "16px",
              fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
              fontWeight: 500,
            }}
          >
            Elevate Every Sip and Serve
          </Title>

          <Paragraph
            style={{
              color: "white",
              fontSize: "clamp(16px, 2vw, 22px)",
              marginBottom: "34px",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              opacity: 0.9,
            }}
          >
            With Premium Glassware
          </Paragraph>

          <Link to="/shop">
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: "#a58563",
                borderColor: "#a58563",
                padding: "0 38px",
                height: "48px",
                fontSize: "16px",
                borderRadius: "1px",
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                fontWeight: 500,
              }}
            >
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>

      {/* Promotional Banner */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          textAlign: "center",
          padding: "6px 0",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "'Hanken Grotesk', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        <marquee style={{ color: "#594131" }} behavior="scroll" direction="left" scrollamount="6">
          4L+ Happy Customers | Gifts For Her @ 50% OFF | Ships in 24 hours &nbsp;&nbsp;&nbsp;
          4L+ Happy Customers | Gifts For Her @ 50% OFF | Ships in 24 hours
        </marquee>
      </div>
    </>
  );
};

export default Hero;
