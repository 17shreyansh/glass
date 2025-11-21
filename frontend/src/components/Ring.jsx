import React from "react";
import ringImage from "../assets/ring.png";



export default function Ring() {
  const sectionStyle = {
    textAlign: "center",
    padding: "50px 10px",
    fontFamily: "'Josefin Sans', sans-serif",
    backgroundColor: "#fff",
    position: "relative",
  };

  const imageStyle = {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "0 auto",
    marginBottom: "30px",
    userSelect: "none",
    pointerEvents: "none"
  };

  const upperHeadingStyle = {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "28px",
    fontWeight: "300",
    color: "#333",
    marginBottom: "20px",
  };

  const lowerHeadingStyle = {
    fontFamily: "'Prata', serif",
    fontSize: "32px",
    fontWeight: "500",
    color: "#204e43",
    // marginBottom: "40px",
  };

  return (
    <div style={sectionStyle}>
      <h2 style={upperHeadingStyle}>More Than Jewellery</h2>
      <h1 style={lowerHeadingStyle}>Ashtadhatu : Statement of Soul & Style</h1>
      <img src={ringImage} alt="Ring" style={imageStyle} />
    </div>
  );
}