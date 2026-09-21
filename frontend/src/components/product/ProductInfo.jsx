import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const discount = product.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const variantText = [product.material, product.weight].filter(Boolean).join(" | ");
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) return navigate("/login");
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(product.stock || 99, q + 1));

  const btnBase = {
    width: "100%", maxWidth: "520px", height: "50px",
    border: "none", borderRadius: "50px", fontWeight: 700,
    fontSize: "14px", letterSpacing: "0.06em", cursor: "pointer",
    transition: "opacity 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>

      {/* Name */}
      <h1 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.3 }}>
        {product.name}
      </h1>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
        {[1,2,3,4,5].map((s) => (
          <FaStar key={s} size={14} color={s <= Math.round(product.rating || 5) ? "#54C69D" : "#ddd"} />
        ))}
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{Number(product.rating || 5).toFixed(1)}</span>
        <span style={{ fontSize: "13px", color: "#666" }}>({product.reviews || 0} Reviews)</span>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "#111" }}>
          ₹{price.toLocaleString("en-IN")}
        </span>
        {originalPrice > price && (
          <span style={{ fontSize: "16px", color: "#999", textDecoration: "line-through" }}>
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        {discount > 0 && (
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#54C69D", backgroundColor: "rgba(84,198,157,0.12)", padding: "3px 10px", borderRadius: "20px" }}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Material / Weight */}
      {variantText && (
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>{variantText}</p>
      )}

      {/* Stock */}
      <span style={{
        fontSize: "13px", fontWeight: 600,
        color: inStock ? "#54C69D" : "#e74c3c",
        backgroundColor: inStock ? "rgba(84,198,157,0.10)" : "rgba(231,76,60,0.08)",
        padding: "4px 14px", borderRadius: "20px",
      }}>
        {inStock ? `✓ In Stock (${product.stock} left)` : "✗ Out of Stock"}
      </span>

      {/* Description */}
      {product.description && (
        <p style={{ fontSize: "14px", color: "#555", maxWidth: "480px", lineHeight: 1.7, margin: "4px 0 0" }}>
          {product.description}
        </p>
      )}

      {/* Divider */}
      <div style={{ width: "100%", maxWidth: "520px", height: "1px", backgroundColor: "#eee", margin: "4px 0" }} />

      {/* Quantity */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#666", letterSpacing: "0.05em" }}>QUANTITY</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1.5px solid #e0e0e0", borderRadius: "50px", overflow: "hidden" }}>
          <button onClick={dec} style={{ width: "42px", height: "42px", border: "none", background: "#F8FAF9", fontSize: "18px", cursor: "pointer", color: "#111", fontWeight: 600 }}>−</button>
          <span style={{ width: "48px", textAlign: "center", fontSize: "16px", fontWeight: 700, color: "#111" }}>{quantity}</span>
          <button onClick={inc} disabled={!inStock} style={{ width: "42px", height: "42px", border: "none", background: "#F8FAF9", fontSize: "18px", cursor: "pointer", color: "#111", fontWeight: 600 }}>+</button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock}
        style={{ ...btnBase, backgroundColor: inStock ? "#54C69D" : "#d9d9d9", color: inStock ? "#111" : "#888" }}
        onMouseEnter={(e) => inStock && (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        ADD TO CART
      </button>

      {/* Buy Now */}
      <button
        onClick={handleBuyNow}
        disabled={!inStock}
        style={{ ...btnBase, backgroundColor: "#111", color: "#fff" }}
        onMouseEnter={(e) => inStock && (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        BUY NOW
      </button>

      {/* Wishlist */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: wishlisted ? "#e74c3c" : "#666", fontSize: "14px", fontWeight: 500, padding: "4px 0" }}
      >
        {wishlisted ? <FaHeart size={16} color="#e74c3c" /> : <FaRegHeart size={16} />}
        {wishlisted ? "Wishlisted" : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default ProductInfo;
