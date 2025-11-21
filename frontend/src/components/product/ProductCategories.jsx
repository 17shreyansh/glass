import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";

const ProductCategories = () => {
  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "80px 10px",
          textAlign: "center",
          fontFamily: "'Josefin Sans', sans-serif",
          overflowX: "hidden",
        }}
      >
      {/* Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400&family=Prata&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <p
          style={{
            color: "#333",
            fontSize: "15px",
            marginBottom: "40px",
            letterSpacing: "0.5px",
          }}
        >
          Click to Explore
        </p>

        <Row gutter={[32, 32]} align="middle" justify="center">
          {/* ---------- LEFT COLUMN ---------- */}
          <Col xs={24} md={12}>
            <div
              style={{
                position: "relative",
                maxWidth: "380px",
                margin: "0 auto",
              }}
            >
              <img
                src={p1}
                alt="Ashtadhatu Jewellery"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
             
            </div>

            <p
              style={{
                fontStyle: "italic",
                color: "#5f5f5f",
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "4px",
              }}
            >
              Unveil the Sacred
            </p>

            <Link
              to="/ashta-dhatu"
              style={{
                display: "block",
                fontFamily: "'Prata', serif",
                fontSize: "28px",
                color: "#0d4b4b",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#1a6a6a")}
              onMouseLeave={(e) => (e.target.style.color = "#0d4b4b")}
            >
              Explore Ashtadhatu Jewellery
            </Link>
          </Col>

          {/* ---------- RIGHT COLUMN ---------- */}
          <Col xs={24} md={12}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                maxWidth: "380px",
                margin: "0 auto",
              }}
            >
              <img
                src={p2}
                alt="Fashion Jewellery"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              
            </div>

            <p
              style={{
                fontStyle: "italic",
                color: "#5f5f5f",
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "4px",
              }}
            >
              Define Your Style
            </p>

            <Link
              to="/fashion-jewelry"
              style={{
                display: "block",
                fontFamily: "'Prata', serif",
                fontSize: "28px",
                color: "#0d4b4b",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#1a6a6a")}
              onMouseLeave={(e) => (e.target.style.color = "#0d4b4b")}
            >
              Shop Fashion Jewellery
            </Link>
          </Col>
        </Row>
      </div>
      </div>
      
      {/* Promotional Banner */}
      <div
        style={{
          backgroundColor: '#0d4b4b',
          color: '#fff',
          textAlign: 'center',
          padding: '6px 0',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: "'Josefin Sans', sans-serif",
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: 'scrollText 20s linear infinite',
          }}
        >
          4L+ Happy Customers | Gifts For Her @ 50% OFF | Ships in 24 hours &nbsp;&nbsp;&nbsp;
          4L+ Happy Customers | Gifts For Her @ 50% OFF | Ships in 24 hours
        </div>
      </div>
    </>
  );
};

export default ProductCategories;
