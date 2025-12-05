import React, { useState, useEffect } from "react";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { message, Input, Button, Space } from "antd";
import contactImage from "../assets/contact.jpg";
import Footer from "../components/layout/Footer";
import axios from "axios";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      message.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/contacts/subscribe`,
        { email }
      );
      message.success(data.message || "Successfully subscribed!");
      setEmail("");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Prata', serif",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          textAlign: "center",
          paddingTop: isMobile ? "30px" : "50px",
          marginBottom: isMobile ? "30px" : "40px",
          fontSize: "clamp(28px, 5vw, 36px)",
          fontWeight: 400,
          padding: "0 20px",
        }}
      >
        Contact Us
      </h1>

      {/* Newsletter Section */}
      <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
        <p
          style={{
            fontFamily: "'HK Grotesk', sans-serif",
            fontSize: isMobile ? "14px" : "15px",
            opacity: 0.8,
            marginBottom: "25px",
            lineHeight: "1.6",
          }}
        >
          Join our mailing list and we promise to only send you the good stuff.
          You’ll get early access to all news,
          competitions and pre-sale on Limited Editions.
        </p>

        {/* Input */}
        <form onSubmit={handleSubscribe}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              size={isMobile ? "middle" : "large"}
              style={{
                fontFamily: "'HK Grotesk', sans-serif",
                background: "#fff",
                color: "#000",
                border: "1px solid #fff",
              }}
            />
            <Button
              htmlType="submit"
              loading={loading}
              size={isMobile ? "middle" : "large"}
              icon={<ArrowRightOutlined />}
              style={{
                fontFamily: "'HK Grotesk', sans-serif",
                background: "#fff",
                color: "#000",
                border: "1px solid #fff",
              }}
            />
          </Space.Compact>
        </form>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          marginTop: isMobile ? "40px" : "60px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          width: "100%",
          backgroundColor: "#000",
          minHeight: isMobile ? "auto" : "500px",
        }}
      >
        {/* Left image */}
        <div style={{ width: isMobile ? "100%" : "50%", overflow: "hidden", minHeight: isMobile ? "250px" : "300px" }}>
          <img
            src={contactImage}
            alt="Contact"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Right side info */}
        <div
          style={{
            width: isMobile ? "100%" : "50%",
            background: "#000",
            padding: isMobile ? "40px 20px" : "70px 60px",
            fontFamily: "'HK Grotesk', sans-serif",
          }}
        >
          {/* Address */}
          <div style={{ marginBottom: isMobile ? "30px" : "40px" }}>
            <EnvironmentOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
            <span style={{ fontSize: isMobile ? "15px" : "16px" }}>MV CRAFTED IMPEX</span>
            <p style={{ marginTop: "10px", lineHeight: "1.8", opacity: 0.9, fontSize: isMobile ? "14px" : "16px" }}>
              A-44, RENUKA BAGH <br />
              KAMLA NAGAR <br />
              AGRA – 282005 (U.P.) <br />
              INDIA
            </p>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "30px" }}>
            <PhoneOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
            <span style={{ fontSize: isMobile ? "15px" : "16px", wordBreak: "break-word" }}>+91 9084250567 (WHATSAPP)</span>
          </div>

          {/* Email */}
          <div>
            <MailOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
            <span style={{ fontSize: isMobile ? "15px" : "16px", wordBreak: "break-word" }}>MVCRAFTEDIMPEX@GMAIL.COM</span>
          </div>

          {/* Phone */}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
