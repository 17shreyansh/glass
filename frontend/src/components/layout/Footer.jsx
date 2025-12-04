import React from "react";
import { Layout, Row, Col, Input, Button, Typography, Space } from "antd";
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
              alt="Delicorn Logo"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Shop</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Collections</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Brands</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>About Us</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Contact Us</Text>
          </Space>
        </Col>

        {/* Policies 1 */}
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
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Shipping</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Returns</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Privacy Policy</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Terms</Text>
          </Space>
        </Col>

        {/* Policies 2 */}
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
            Policies
          </Title>
          <Space direction="vertical" size="small">
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Shipping</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Returns</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Privacy Policy</Text>
            <Text style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif", color: "white" }}>Terms</Text>
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
        <InstagramOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        <FacebookOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        <TwitterOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
        <YoutubeOutlined style={{ fontSize: window.innerWidth <= 768 ? "18px" : "20px", cursor: "pointer", color: "white" }} />
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
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          {" | "}
          <span style={{ cursor: "pointer" }}>Terms and Conditions</span>
          {window.innerWidth > 768 && " | "}
          {window.innerWidth <= 768 && <br />}
          Made with love and craft by AFFOBE
        </Text>
      </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
