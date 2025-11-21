import React from "react";
import { Button } from "antd";
import jewelleryImage from "../assets/jewelleryImage.jpg"; // replace with your correct path

const JewelleryCircleBanner = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isSmallMobile, setIsSmallMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    backgroundImage: `url(${jewelleryImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    width: "100%",
    minHeight: isSmallMobile ? "400px" : isMobile ? "500px" : "680px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: isSmallMobile ? "30px 15px" : isMobile ? "40px 20px" : "60px 120px",
    boxSizing: "border-box",
    color: "white"
  };

  const titleStyle = {
    fontFamily: "Prata, serif",
    fontSize: "clamp(32px, 8vw, 60px)",
    fontWeight: 400,
    lineHeight: "1.1",
    margin: 0,
    color: "white",
  };

  const descriptionStyle = {
    fontSize: "clamp(18px, 4vw, 32px)",
    lineHeight: "1.4",
    fontWeight: 400,
    marginBottom: "40px",
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: "white",
    color: "black",
    border: "none",
    fontSize: "clamp(16px, 2.5vw, 20px)",
    fontFamily: "Josefin Sans, sans-serif",
    padding: "10px 50px",
    borderRadius: "0",
    height: "auto",
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      
      {/* Top Section */}
      <div
        style={{
          textAlign: "left",
          color: "white",
        }}
      >
        <h1 style={titleStyle}>
          Join Our <br /> Jewellery Circle
        </h1>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          textAlign: isMobile ? "center" : "right",
          fontFamily: "Josefin Sans, sans-serif",
          color: "white",
        }}
      >
        <p style={descriptionStyle}>
          Get <strong>10% OFF</strong> on your first order {!isSmallMobile && <br />}
          when you sign up!
        </p>

        <Button style={buttonStyle}>
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default JewelleryCircleBanner;
