import React from "react";
import { Row, Col, Button } from "antd";

// Import category images
import img1 from "../assets/c1.jpg";
import img2 from "../assets/c2.jpg";
import img3 from "../assets/c3.jpg";
import img4 from "../assets/c4.jpg";
import img5 from "../assets/c5.jpg";
import img6 from "../assets/c6.png";
import img7 from "../assets/c7.png";
import img8 from "../assets/c8.png";

const categories = [
  { name: "All Glassware", image: img1 },
  { name: "Cocktail Glass", image: img2 },
  { name: "Coupe Glass", image: img3 },
  { name: "Shot Glass", image: img4 },
  { name: "Tableware Glass", image: img5 },
  { name: "Wine Glass", image: img6 },
  { name: "Champagne Glass", image: img7 },
  { name: "Whiskey Glass", image: img8 },
];

export default function Categories() {
  return (
    <div
      style={{
        backgroundColor: "#8E6A4E",
        padding: "40px 0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
          color: "white",
          fontSize: "clamp(24px, 5vw, 36px)",
          marginBottom: "30px",
        }}
      >
        Categories
      </h2>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={[4, 4]}>
          {categories.map((cat, index) => (
            <Col key={index} xs={24} sm={12} md={6} lg={6}>
              <div
                style={{
                  backgroundColor: "#FAF7EF",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", paddingBottom: "100%" }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0)",
                      color: "white",
                      padding: "8px 10px",
                      fontSize: "clamp(14px, 2.5vw, 18px)",
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {cat.name}
                  </div>
                </div>

               
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}