import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import c1 from "../assets/s1.jpg";
import c2 from "../assets/s2.jpg";
import c3 from "../assets/s3.png";
import c4 from "../assets/s4.jpg";
import c5 from "../assets/s5.jpg";

const Slider = () => {
  const slides = [c1, c2, c3, c4, c5];

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 0",
        position: "relative",
      }}
    >
      {/* Left Arrow */}
      <div
        className="swiper-button-prev"
        style={{
          left: "2%",
          color: "#000",
          fontSize: "18px",
          background: "#fff",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 10,
          cursor: "pointer",
        }}
      >
        <LeftOutlined />
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay, EffectCoverflow]}
        effect="coverflow"
        centeredSlides={true}
        grabCursor={true}
        loop={true}
        slidesPerView="auto"
        spaceBetween={0}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 180,
          modifier: 2.5,
          slideShadows: true,
        }}
        style={{
          width: "90%",
          maxWidth: "800px",
          height: "500px",
        }}
        watchSlidesProgress={true}
      >
        {slides.concat(slides).map((img, index) => ( // 👈 duplicate slides manually for seamless loop
          <SwiperSlide
            key={index}
            style={{
              width: "280px",
              height: "500px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              background: "#fff",
              transition: "transform 0.3s ease",
            }}
          >
            <img
              src={img}
              alt={`slide-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right Arrow */}
      <div
        className="swiper-button-next"
        style={{
          right: "2%",
          color: "#000",
          fontSize: "18px",
          background: "#fff",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 10,
          cursor: "pointer",
        }}
      >
        <RightOutlined />
      </div>
    </div>
  );
};

export default Slider;
