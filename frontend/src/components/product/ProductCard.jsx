import React from "react";
import { HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUser();

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.stopPropagation();
    isInWishlist(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewDetails = () => navigate(`/product/${product.slug}`);

  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const imageUrl = product.mainImage
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${product.mainImage}`
    : product.image;

  return (
    <div
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        maxWidth: 260,
        background: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* IMAGE BLOCK */}
      <div style={{ position: "relative", background: "#f5f5f5" }}>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              borderRadius: "10px 10px 0 0",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0b0b0"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Wishlist */}
        <div
          onClick={handleWishlist}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 22,
            color: isInWishlist(product._id) ? "#ff4d4f" : "white",
            textShadow: "0 0 4px rgba(0,0,0,0.6)",
          }}
        >
          <HeartOutlined />
        </div>

        {/* Add to cart BAR */}
        <div
          onClick={handleAddToCart}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "12px 0",
            background: "#b58c6a",
            color: "white",
            fontWeight: 600,
            fontSize: 17,
            textAlign: "center",
          }}
        >
          Add to cart
        </div>
      </div>

      {/* BOTTOM TEXT CONTENT */}
      <div style={{ padding: "10px 12px" }}>

        {/* Title */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 6,
            color: "#333",
          }}
        >
          {product.name}
        </div>

        {/* Price section */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#222",
            }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          {product.originalPrice && (
            <>
              <div
                style={{
                  textDecoration: "line-through",
                  color: "#7a7a7a",
                  fontSize: 15,
                }}
              >
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </div>
              <div
                style={{
                  color: "#3c8c3c",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                ({discountPercent}%)
              </div>
            </>
          )}
        </div>

        {/* Stars */}
        <div
          style={{
            marginTop: 6,
            fontSize: 16,
            color: "#f2c94c",
          }}
        >
          {"⭐".repeat(Math.floor(product.rating || 4))}
          {"☆".repeat(5 - Math.floor(product.rating || 4))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
