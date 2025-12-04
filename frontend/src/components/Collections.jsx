import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

// Import default category images as fallback
import img1 from "../assets/c1.jpg";
import img2 from "../assets/c2.jpg";
import img3 from "../assets/c3.jpg";
import img4 from "../assets/c4.jpg";
import img5 from "../assets/c5.jpg";
import img6 from "../assets/c6.png";
import img7 from "../assets/c7.png";
import img8 from "../assets/c8.png";

const defaultImages = [img1, img2, img3, img4, img5, img6, img7, img8];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        const cats = response.data || response;
        // Only show top-level categories (level 0)
        const topLevel = cats.filter(cat => cat.level === 0).slice(0, 8);
        setCategories(topLevel);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  const getCategoryImage = (category, index) => {
    if (category.image && !category.image.includes('placeholder')) {
      return `${API_BASE_URL.replace('/api', '')}${category.image}`;
    }
    return defaultImages[index % defaultImages.length];
  };

  return (
    <div
      style={{
        backgroundColor: "#8E6A4E",
        padding: window.innerWidth <= 768 ? "30px 0" : "40px 0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontFamily: "'FONTSPRING DEMO - The Seasons', 'Playfair Display', serif",
          color: "white",
          fontSize: "clamp(24px, 5vw, 36px)",
          marginBottom: window.innerWidth <= 768 ? "20px" : "30px",
        }}
      >
        Categories
      </h2>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: window.innerWidth <= 768 ? "0 10px" : "0 20px" }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            No categories available
          </div>
        ) : (
        <Row gutter={window.innerWidth <= 768 ? [8, 8] : [4, 4]}>
          {categories.map((cat, index) => (
            <Col key={index} xs={12} sm={12} md={6} lg={6}>
              <div
                onClick={() => handleCategoryClick(cat.slug)}
                style={{
                  backgroundColor: "#FAF7EF",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ position: "relative", paddingBottom: "100%" }}>
                  <img
                    src={getCategoryImage(cat, index)}
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
                      padding: window.innerWidth <= 768 ? "6px 8px" : "8px 10px",
                      fontSize: window.innerWidth <= 768 ? "11px" : "clamp(14px, 2.5vw, 18px)",
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
        )}
      </div>
    </div>
  );
}