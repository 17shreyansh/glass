import React, { useState, useEffect } from "react";
import image1 from "../assets/sc1.png"; // Whiskey (Wide)
import image2 from "../assets/sc2.png"; // Sunlight (Square/Tall)
import image3 from "../assets/sc3.png"; // Blue Drinks
import image4 from "../assets/sc4.png"; // Tall Vase
import image5 from "../assets/sc5.png"; // Decanter
import image6 from "../assets/sc6.png"; // Hand with ice
import image7 from "../assets/sc7.png"; // Lavender drink

const GlassCollage = () => {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Grid logic: 4 Columns, 3 Rows for desktop, 2 columns for mobile
  const items = isMobile ? [
    { id: 1, img: image1, area: "1 / 1 / 2 / 3" },
    { id: 2, img: image2, area: "2 / 1 / 3 / 2" },
    { id: 3, img: image3, area: "2 / 2 / 3 / 3" },
    { id: 4, img: image4, area: "3 / 1 / 4 / 2" },
    { id: 5, img: image5, area: "3 / 2 / 4 / 3" },
    { id: 6, img: image6, area: "4 / 1 / 5 / 2" },
    { id: 7, img: image7, area: "4 / 2 / 5 / 3" },
  ] : [
    // 1. Top Left (Whiskey on wood) - Spans 2 cols, 1 row
    { id: 1, img: image1, area: "1 / 1 / 2 / 3" },

    // 2. Bottom Left (Sunlight glass) - Spans 1 col, 2 rows
    { id: 2, img: image2, area: "2 / 1 / 4 / 2" },

    // 3. Bottom Mid-Left (Blue drinks) - Spans 1 col, 2 rows
    { id: 3, img: image3, area: "2 / 2 / 4 / 3" },

    // 4. Center (Tall Vase) - Spans 1 col, Full Height (3 rows)
    { id: 4, img: image4, area: "1 / 3 / 4 / 4" },

    // 5. Right Top (Decanter)
    { id: 5, img: image5, area: "1 / 4 / 2 / 5" },

    // 6. Right Middle (Hand)
    { id: 6, img: image6, area: "2 / 4 / 3 / 5" },

    // 7. Right Bottom (Lavender)
    { id: 7, img: image7, area: "3 / 4 / 4 / 5" },
  ];
  
  return (
    <div
      style={{
        display: "grid",
        // 4 Columns: Left, Mid-Left, Center-Vase, Right-Stack
        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1.2fr 1fr", 
        // 3 Equal Rows
        gridTemplateRows: isMobile ? "repeat(4, 1fr)" : "1fr 1fr 1fr", 
        gap: isMobile ? "8px" : "12px",
        width: "100%",
        // Use a fixed height or view-height to maintain the grid ratio
        height: isMobile ? "auto" : "90vh",
        minHeight: isMobile ? "600px" : "auto",
        padding: isMobile ? "15px" : "20px",
        boxSizing: "border-box",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: isMobile ? "8px" : "14px",
            cursor: "pointer",
            gridArea: item.area,
            transform: hovered === item.id ? "scale(1.02)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            boxShadow: hovered === item.id ? "0 10px 20px rgba(0,0,0,0.2)" : "none",
            zIndex: hovered === item.id ? 2 : 1,
            minHeight: isMobile ? "120px" : "auto",
          }}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={item.img}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            alt=""
          />

          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                right: "14px",
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(5px)", // Adds the glassy blur effect
                borderRadius: "20px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "500",
                opacity: hovered === item.id ? 1 : 0,
                transform: hovered === item.id ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Explore more..
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GlassCollage;