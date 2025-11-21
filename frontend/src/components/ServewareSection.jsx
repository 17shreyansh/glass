import React from "react";
import { Typography } from "antd";
import glassImg from "../assets/glass.png";

const { Title } = Typography;

export default function ServewareSection() {
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
          boxSizing: "border-box",
        }}
      >
        <img
          src={glassImg}
          alt="glass-serveware"
          style={{
            width: "800px",
            height: "80%",
            objectFit: "contain",
          }}
        />
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
          Serveware
        </Title>
      </div>
    </>
  );
}