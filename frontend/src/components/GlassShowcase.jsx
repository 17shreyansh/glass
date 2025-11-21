import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ellipse4 from '../assets/Ellipse 4.svg';
import ellipse5 from '../assets/Ellipse 5.svg';
import g1 from '../assets/g1.png';
import g2 from '../assets/g2.png';
import g3 from '../assets/g3.png';
import g4 from '../assets/g4.png';
import g5 from '../assets/g5.png';
import g6 from '../assets/g6.png';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};


const GlassShowcase = () => {
  const [currentGlass, setCurrentGlass] = useState(0);
  const isMobile = useIsMobile();
  
  // Customizable gap between glasses (0.25 = 90 degrees, 0.125 = 45 degrees, etc.)
  const glassGap = 0.28;

  const glassData = [
    {
      id: 1,
      name: "Classic Aviator",
      description: "Timeless style meets modern comfort",
      bgColor: "#1a1a2e",
      accentColor: "#667eea",
      textColor: "#ffffff",
      ellipseColor: "#667eea",
      asset: g1
    },
    {
      id: 2,
      name: "Urban Explorer",
      description: "Bold design for the adventurous spirit",
      bgColor: "#0f3460",
      accentColor: "#4facfe",
      textColor: "#ffffff",
      ellipseColor: "#4facfe",
      asset: g2
    },
    {
      id: 3,
      name: "Retro Vintage",
      description: "Classic elegance with a modern twist",
      bgColor: "#533483",
      accentColor: "#f093fb",
      textColor: "#ffffff",
      ellipseColor: "#f093fb",
      asset: g3
    },
    {
      id: 4,
      name: "Sport Elite",
      description: "Performance meets style",
      bgColor: "#2d1b69",
      accentColor: "#00f2fe",
      textColor: "#ffffff",
      ellipseColor: "#00f2fe",
      asset: g4
    },
    {
      id: 5,
      name: "Chic Minimalist",
      description: "Sleek design for the modern individual",
      bgColor: "#16213e",
      accentColor: "#fbc7aa",
      textColor: "#ffffff",
      ellipseColor: "#fbc7aa",
      asset: g5
    },
    {
      id: 6,
      name: "Futuristic Vision",      
      description: "Innovative design for the forward-thinker",
      bgColor: "#0b0c10",
      accentColor: "#6afff0",
      textColor: "#ffffff",
      ellipseColor: "#6afff0",
      asset: g6
    } 
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGlass((prev) => (prev + 1) % glassData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentData = glassData[currentGlass];
  
  const getVisibleGlasses = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentGlass + i) % glassData.length;
      visible.push({ ...glassData[index], displayIndex: i });
    }
    return visible;
  };

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.8s ease',
        backgroundColor: currentData.bgColor,
        color: currentData.textColor
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: isMobile ? '300px' : '500px',
          height: isMobile ? '300px' : '500px',
          backgroundColor: currentData.ellipseColor,
          mask: `url(${ellipse5}) no-repeat center/contain`,
          WebkitMask: `url(${ellipse5}) no-repeat center/contain`,
          transition: 'background-color 0.8s ease'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0%',
          right: '0%',
          width: isMobile ? '400px' : '700px',
          height: isMobile ? '400px' : '700px',
          backgroundColor: currentData.ellipseColor,
          mask: `url(${ellipse4}) no-repeat center/contain`,
          WebkitMask: `url(${ellipse4}) no-repeat center/contain`,
          transition: 'background-color 0.8s ease'
        }} />
      </div>

      {/* Title, paragraph and button on ellipse5 - upper left */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '15%' : '10%',
        left: isMobile ? '10px' : '5%',
        right: isMobile ? '10px' : 'auto',
        zIndex: 3,
        maxWidth: isMobile ? 'none' : '400px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <h1 style={{
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>{currentData.name}</h1>
        <p style={{
          fontSize: isMobile ? '1rem' : '1.2rem',
          opacity: 0.9,
          marginBottom: '2rem'
        }}>{currentData.description}</p>
        <button 
          style={{ 
            padding: isMobile ? '0.8rem 1.5rem' : '1rem 2rem',
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: 'bold',
            color: 'white',
            border: '2px solid',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: currentData.accentColor,
            borderColor: currentData.accentColor
          }}
        >
          Shop Now
        </button>
      </div>

        <div style={{
          position: 'relative',
          width: '100vw',
          height: '100vh'
        }}>
          {glassData.map((glass, index) => {
            const relativeIndex = (index - currentGlass + glassData.length) % glassData.length;
            const isVisible = relativeIndex < 4;
            const progress = (relativeIndex * glassGap) + (30 / 360);
            
            const ellipse4Path = isMobile ? {
              centerX: window.innerWidth / 2,
              centerY: window.innerHeight - 150,
              radiusX: 120,
              radiusY: 120
            } : {
              centerX: window.innerWidth - 500,
              centerY: window.innerHeight - 400,
              radiusX: 350,
              radiusY: 350
            };
            
            return (
              <motion.div
                key={glass.id}
                animate={{
                  opacity: isVisible ? 1 : 0
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  zIndex: relativeIndex === 0 ? 10 : 1
                }}
              >
                <motion.div
                  animate={{
                    offsetDistance: isVisible ? `${progress * 100}%` : `${progress * 100}%`
                  }}
                  transition={{
                    duration: isVisible ? 0.8 : 0,
                    ease: "easeInOut"
                  }}
                  style={{
                    offsetPath: `path("M ${ellipse4Path.centerX + ellipse4Path.radiusX} ${ellipse4Path.centerY} A ${ellipse4Path.radiusX} ${ellipse4Path.radiusY} 0 1 1 ${ellipse4Path.centerX - ellipse4Path.radiusX} ${ellipse4Path.centerY} A ${ellipse4Path.radiusX} ${ellipse4Path.radiusY} 0 1 1 ${ellipse4Path.centerX + ellipse4Path.radiusX} ${ellipse4Path.centerY}")`,
                    offsetRotate: '0deg',
                    width: '80px',
                    height: '80px'
                  }}
                >
                  <img
                    src={glass.asset}
                    alt={glass.name}
                    style={{
                      width: isMobile ? '150px' : '400px',
                      objectFit: 'contain',
                      transition: 'filter 0.3s ease'
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      <div style={{
        position: 'absolute',
        bottom: isMobile ? '1rem' : '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: isMobile ? '0.5rem' : '1rem',
        zIndex: 3
      }}>
        {glassData.map((_, index) => (
          <div
            key={index}
            style={{ 
              width: isMobile ? '8px' : '12px',
              height: isMobile ? '8px' : '12px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: index === currentGlass ? currentData.accentColor : 'rgba(255,255,255,0.3)'
            }}
            onClick={() => setCurrentGlass(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GlassShowcase;e;e;howcase;