import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "antd";
import image from "../assets/js.png"; // Banner with jewelry and text
import girl from "../assets/js1.jpg"; // Model photo

const JewelrySale = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    backgroundColor: "#FFF9EB",
    fontFamily: "'Josefin Sans', sans-serif",
    paddingTop: isMobile ? "20px" : "40px",
    paddingRight: isMobile ? "15px" : "20px",
    paddingBottom: isMobile ? "20px" : "40px",
    paddingLeft: isMobile ? "15px" : "20px",
  };

  const rowStyle = {
    maxWidth: "1400px",
    marginTop: "0",
    marginRight: "auto",
    marginBottom: "0",
    marginLeft: "auto",
    borderRadius: "10px",
    overflow: "hidden",
    minHeight: isMobile ? "auto" : "550px",
  };

  const leftColStyle = {
    height: isMobile ? "200px" : "550px",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    display: "flex",
    alignItems: "flex-end",
    marginTop: "0",
    marginRight: "0",
    marginBottom: isMobile ? "15px" : "0",
    marginLeft: "0",
  };

  const rightColStyle = {
    position: "relative",
    height: "550px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    objectPosition: "top"
  };

  const modelImageStyle = {
    width: isMobile ? "100%" : "90%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    borderRadius: isMobile ? "200px 200px 0 0" : "300px 300px 0 0",
  };

  const buttonContainerStyle = {
    position: "absolute",
    bottom: "0",
    width: isMobile ? "100%" : "90%",
    textAlign: "center",
    backgroundColor: "#0f4a3b",
    paddingTop: isMobile ? "12px" : "16px",
    paddingRight: "0",
    paddingBottom: isMobile ? "12px" : "16px",
    paddingLeft: "0",
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: isMobile ? "16px" : "20px",
    fontWeight: "500",
    fontFamily: "'Josefin Sans', sans-serif",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <Row
        justify="center"
        align={isMobile ? "top" : "bottom"}
        gutter={isMobile ? [0, 0] : [8, 0]}
        style={rowStyle}
      >
        <Col
          xs={24}
          sm={24}
          md={17}
          lg={17}
          xl={17}
          style={leftColStyle}
        >
          <img
            src={image}
            alt="Jewelry Banner"
            style={imageStyle}
          />
        </Col>

        <Col
          xs={24}
          sm={24}
          md={7}
          lg={7}
          xl={7}
          style={rightColStyle}
        >
          <img
            src={girl}
            alt="Model"
            style={modelImageStyle}
          />
          <div style={buttonContainerStyle}>
            <Button
              type="text"
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#145a4a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Shop Now
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JewelrySale;