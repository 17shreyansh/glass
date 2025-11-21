import React from "react";
import { Typography } from "antd";
import missionImg from "../assets/image.png"; // ← Replace with your actual image

const { Title, Paragraph } = Typography;

export default function MissionSection() {
  return (
    <>
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        // padding: "60px 0",
        boxSizing: "border-box",
      }}
    >
      {/* Left Image */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", height: "100%" }}>
        <img
          src={missionImg}
          alt="mission-img"
          style={{
            width: "500px",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Right Text */}
      <div
        style={{
          flex: 1,
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{
          marginBottom: "10px", fontWeight: 500, fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
        }}>
          Our Mission
        </Title>

        <Paragraph style={{ fontStyle: "italic", color: "#8E6A4E" }}>
          To redefine glassware for modern homes&nbsp;– sustainable, stunning,
          and made to be cherished
        </Paragraph>

        <Paragraph
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#8E6A4E",
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
          }}
        >
          We believe that everyday moments deserve a touch of brilliance.
        </Paragraph>

        <Paragraph
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#8E6A4E",
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",


          }}
        >
          Founded with a passion for design and craftsmanship, we create
          glassware that blends aesthetic beauty with lasting quality.
        </Paragraph>

        <Paragraph
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#8E6A4E",
            fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",

          }}
        >
          From artisanal makers to modern innovation, our pieces reflect
          elegance, sustainability, and timeless appeal.
        </Paragraph>
        
      </div>
      
    </div>
    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: "20px 0",
        backgroundColor: "#594131",
      }}
    >
      <Title 
        level={2} 
        style={{
          fontWeight: 500,
          fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
          color: "white",
          verticalAlign: "center",
          margin: "0",
        }}
      >
        Gift Sets
      </Title>
    </div>
    </>
  );
}