import React from "react";
import { Button } from "antd";
import image1 from "../assets/cta1.jpg"; // replace with your correct path
import image2 from "../assets/cta2.jpg"; // replace with your correct path


export default function JewelleryBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        padding: "40px 20px",
        fontFamily: "'Josefin Sans', sans-serif",
        flexWrap: "wrap",
        gap: "20px",
        maxWidth: "100%",

      }}
    >
      {/* Left Section - Images */}
      <div style={{ display: "flex", position: "relative", flex: "0 0 auto", maxWidth: "100%" }}>
        {/* First Image (Main) */}
        <div
          style={{
            width: "clamp(200px, 40vw, 300px)",
            height: "clamp(220px, 45vw, 340px)",
            borderRadius: "300px 300px 0 0",
            border: "2px solid #F8E6B6",
            padding: "8px",
            zIndex: 2,
          }}
        >
          <img
            src={image1}
            alt="Jewellery"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "300px 300px 0 0" }}
          />
        </div>

        {/* Second Image (Overlay) */}
        <div
          style={{
            width: "clamp(150px, 30vw, 200px)",
            height: "clamp(170px, 35vw, 240px)",
            borderRadius: "300px 300px 0 0",
            border: "2px solid #F8E6B6",
            padding: "8px",
            position: "absolute",
            bottom: "0",
            left: "60%",
            zIndex: 3,
          }}
        >
          <img
            src={image2}
            alt="Jewellery"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "300px 300px 0 0" }}
          />
        </div>
      </div>

      {/* Right Section - Text */}
      <div style={{ flex: "1 1 300px", maxWidth: "500px", textAlign: "left" }}>
        <h2
          style={{
            fontFamily: "'Prata', serif",
            fontSize: "clamp(24px, 4vw, 30px)",
            color: "#000",
            marginBottom: "15px",
            fontWeight: "400",
          }}
        >
          Adorn Yourself with Timeless Beauty
        </h2>
        <p
          style={{
            color: "#555",
            marginBottom: "15px",
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: "200",

          }}
        >
          Discover the perfect blend of spiritual heritage and modern elegance.
        </p>
        <p style={{ color: "#555",marginBottom: "15px", fontFamily: "'Josefin Sans', sans-serif", fontWeight: "200" }}>
          From sacred Ashta Dhatu Jewellery to trend-setting Fashion Jewellery,
        </p>
        <p style={{ color: "#555", marginBottom: "25px", fontFamily: "'Josefin Sans', sans-serif", fontWeight: "200" }}>
          Find pieces that reflect your style and soul.
        </p>

        <Button
          type="primary"
          style={{
            backgroundColor: "#8E6A4E",
            borderColor: "#8E6A4E",
            padding: "8px 24px",
            fontWeight: "bold",
            fontSize: "15px",
            borderRadius: "0px",
            transition: "all 0.3s ease",
            fontFamily: "'Josefin Sans', sans-serif",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#A67C5A";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#8E6A4E";
          }}
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
}
