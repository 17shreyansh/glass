import React from "react";
import { Layout, Row, Col, Input, Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import bg from "../../assets/footerbg.jpg";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        background: "url(" + bg + ") no-repeat center",
        backgroundSize: "cover",
        color: "white",
        padding: window.innerWidth <= 768 ? "40px 15px 15px" : "60px 20px 20px",
        fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>
      <Row gutter={window.innerWidth <= 768 ? [20, 30] : [40, 40]} justify="space-between" align="top">
        {/* Left Section */}
        <Col xs={24} md={8}>
          <div style={{ marginBottom: window.innerWidth <= 768 ? "16px" : "24px" }}>
            <img
              src={logo}
              alt="MV Crafted"
              style={{ width: window.innerWidth <= 768 ? "140px" : "180px", marginBottom: window.innerWidth <= 768 ? "16px" : "24px" }}
            />
          </div>

          <Text
            style={{
              display: "block",
              fontSize: window.innerWidth <= 768 ? "13px" : "15px",
              color: "white",
              marginBottom: window.innerWidth <= 768 ? "10px" : "12px",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            }}
          >
            Sign up for exclusive offers, new arrivals & styling tips.
          </Text>

          <div style={{ display: "flex", flexDirection: window.innerWidth <= 768 ? "column" : "row", gap: "10px", marginBottom: window.innerWidth <= 768 ? "16px" : "24px" }}>
            <Input
              placeholder="Enter your email"
              style={{
                flex: 1,
                borderRadius: "2px",
                padding: window.innerWidth <= 768 ? "6px 10px" : "8px 12px",
                fontSize: window.innerWidth <= 768 ? "13px" : "14px",
                border: "1px solid #ccc",
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
              }}
            />
            <Button
              style={{
                backgroundColor: "#8E6A4E",
                color: "white",
                borderRadius: "2px",
                padding: window.innerWidth <= 768 ? "6px 18px" : "0 18px",
                fontSize: window.innerWidth <= 768 ? "13px" : "14px",
                fontWeight: 500,
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                width: window.innerWidth <= 768 ? "100%" : "auto",
              }}
            >
              Subscribe Now
            </Button>
          </div>

          <Text
            style={{
              display: "block",
              fontSize: window.innerWidth <= 768 ? "13px" : "15px",
              color: "white",
              maxWidth: "340px",
              lineHeight: "1.6",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            }}
          >
            Premium glassware and serveware crafted for elegance and durability.
          </Text>
        </Col>

        {/* Quick Links */}
        <Col xs={12} sm={8} md={4}>
          <Title
            level={5}
            style={{
              color: "white",
              marginBottom: window.innerWidth <= 768 ? "12px" : "16px",
              fontSize: window.innerWidth <= 768 ? "16px" : "18px",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            }}
          >
            Quick Links
          </Title>
          <Space direction="vertical" size="small">
            <Link to="/shop" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Shop</Link>
            <Link to="/shop" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Collections</Link>
            <Link to="/about-us" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>About Us</Link>
            <Link to="/contact-us" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Contact Us</Link>
          </Space>
        </Col>

        {/* Policies */}
        <Col xs={12} sm={8} md={4}>
          <Title
            level={5}
            style={{
              color: "white",
              marginBottom: window.innerWidth <= 768 ? "12px" : "16px",
              fontSize: window.innerWidth <= 768 ? "16px" : "18px",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            }}
          >
            Policies
          </Title>
          <Space direction="vertical" size="small">
            <Link to="/legal/shipping-policy" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Shipping</Link>
            <Link to="/legal/return-refund-policy" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Returns</Link>
            <Link to="/legal/privacy-policy" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/legal/terms-conditions" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Terms</Link>
          </Space>
        </Col>

        {/* Customer Service */}
        <Col xs={24} sm={8} md={4}>
          <Title
            level={5}
            style={{
              color: "white",
              marginBottom: window.innerWidth <= 768 ? "12px" : "16px",
              fontSize: window.innerWidth <= 768 ? "16px" : "18px",
              fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
            }}
          >
            Customer Service
          </Title>
          <Space direction="vertical" size="small">
            <Link to="/contact-us" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>FAQ</Link>
            <Link to="/contact-us" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Support</Link>
            <Link to="/account/orders" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Track Order</Link>
            <Link to="/shop" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white", textDecoration: "none" }}>Size Guide</Link>
          </Space>
        </Col>
      </Row>

      {/* Social Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: window.innerWidth <= 768 ? "10px" : "12px",
          marginTop: window.innerWidth <= 768 ? "30px" : "40px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <Text style={{ marginRight: window.innerWidth <= 768 ? "5px" : "10px", color: "white", fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
          Follow us
        </Text>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <InstagramOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FacebookOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <TwitterOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <YoutubeOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        </a>
      </div>

      {/* Bottom Strip */}
      <div
        style={{
          backgroundColor: "#8E6A4E",
          color: "white",
          textAlign: "center",
          padding: window.innerWidth <= 768 ? "10px 5px" : "12px 0",
          marginTop: window.innerWidth <= 768 ? "15px" : "20px",
          marginLeft: window.innerWidth <= 768 ? "-15px" : "-20px",
          marginRight: window.innerWidth <= 768 ? "-15px" : "-20px",
          marginBottom: window.innerWidth <= 768 ? "-15px" : "-20px",
        }}
      >
        <Text style={{ color: "white", fontSize: window.innerWidth <= 768 ? "11px" : "14px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif" }}>
          <Link to="/legal/privacy-policy" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</Link>
          {" | "}
          <Link to="/legal/terms-conditions" style={{ color: "white", textDecoration: "none" }}>Terms and Conditions</Link>
          {window.innerWidth > 768 && " | "}
          {window.innerWidth <= 768 && <br />}
          © {new Date().getFullYear()} MV Crafted. All rights reserved.
          <br />
          Made with love and craft by <a href="https://affobe.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>AFFOBE</a>
        </Text>
      </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
