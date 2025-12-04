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
          justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
          boxSizing: "border-box",
          padding: window.innerWidth <= 768 ? "20px 0" : "0",
        }}
      >
        <img
          src={glassImg}
          alt="glass-serveware"
          style={{
            width: window.innerWidth <= 768 ? "90%" : "800px",
            maxWidth: window.innerWidth <= 768 ? "400px" : "800px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
      
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: window.innerWidth <= 768 ? "15px 0" : "20px 0",
          backgroundColor: "#594131",
        }}
      >
        <Title 
          level={window.innerWidth <= 768 ? 3 : 2}
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