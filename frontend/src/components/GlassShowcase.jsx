import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentGlass((prev) => (prev + 1) % glassData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
        <motion.svg
          width={isMobile ? '300' : '700'}
          height={isMobile ? '300' : '700'}
          viewBox="0 0 647 620"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px'
          }}
        >
          <path d="M599.263 70.5C422.93 226 689.764 548 182.764 612.5C-324.237 677 -233.736 300.527 -233.736 70.5C-233.736 -159.527 -47.2629 -346 182.764 -346C412.79 -346 775.597 -85 599.263 70.5Z" fill={currentData.ellipseColor}/>
        </motion.svg>
        <motion.svg
          width={isMobile ? '400' : '800'}
          height={isMobile ? '400' : '800'}
          viewBox="0 0 989 482"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '0%'
          }}
        >
          <circle cx="574" cy="574.001" r="574" transform="rotate(0.285801 574 574.001)" fill={currentData.ellipseColor}/>
        </motion.svg>
      </div>

      {/* Title, paragraph and button on ellipse5 - upper left */}
      <motion.div 
        key={currentGlass}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: isMobile ? '15%' : '10%',
          left: isMobile ? '10px' : '5%',
          right: isMobile ? '10px' : 'auto',
          zIndex: 3,
          maxWidth: isMobile ? 'none' : '450px',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        <h1 style={{
          fontSize: isMobile ? '2.5rem' : '3.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>{currentData.name}</h1>
        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          opacity: 0.9,
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>{currentData.description}</p>
        <button 
          onClick={() => navigate('/shop')}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ 
            padding: isMobile ? '0.9rem 2rem' : '1.1rem 2.5rem',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontWeight: '600',
            color: 'white',
            border: '2px solid',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: currentData.accentColor,
            borderColor: currentData.accentColor,
            boxShadow: `0 4px 15px ${currentData.accentColor}40`
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 6px 20px ${currentData.accentColor}60`;
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 4px 15px ${currentData.accentColor}40`;
          }}
        >
          Shop Now
        </button>
      </motion.div>

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
                  <motion.img
                    src={glass.asset}
                    alt={glass.name}
                    whileHover={{ scale: relativeIndex === 0 ? 1.1 : 1 }}
                    style={{
                      width: isMobile ? '150px' : '400px',
                      objectFit: 'contain',
                      transition: 'filter 0.3s ease',
                      filter: relativeIndex === 0 ? 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' : 'none',
                      cursor: relativeIndex === 0 ? 'pointer' : 'default'
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      <div style={{
        position: 'absolute',
        bottom: isMobile ? '1.5rem' : '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: isMobile ? '0.6rem' : '1rem',
        zIndex: 3,
        alignItems: 'center'
      }}>
        {glassData.map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              width: index === currentGlass ? (isMobile ? '24px' : '32px') : (isMobile ? '10px' : '12px'),
              height: isMobile ? '10px' : '12px',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              backgroundColor: index === currentGlass ? currentData.accentColor : 'rgba(255,255,255,0.4)',
              boxShadow: index === currentGlass ? `0 0 10px ${currentData.accentColor}` : 'none'
            }}
            onClick={() => {
              setCurrentGlass(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlassShowcase;