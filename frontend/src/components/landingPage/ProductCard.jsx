import React, { useContext } from "react";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const ProductCard = ({ product, adminActions = false, onEdit, onDelete }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || product.price || 0);
  const discount =
    product.discount ||
    (originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  const variantText = [product.material, product.weight]
    .filter(Boolean)
    .join(" | ");

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    if (!adminActions) navigate(`/products/${product._id}`);
  };

  return (
    <div
      className="card h-100 border-0 overflow-hidden"
      onClick={handleCardClick}
      style={{
        backgroundColor: "#fff",
        borderRadius: "14px",
        border: "1px solid rgba(17, 17, 17, 0.08)",
        boxShadow: "0 5px 18px rgba(17, 17, 17, 0.06)",
        transition: "all 0.2s ease",
        cursor: adminActions ? "default" : "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 10px 26px rgba(84, 198, 157, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 5px 18px rgba(17, 17, 17, 0.06)";
      }}
    >
      <div className="px-3 pt-3 pb-0 d-flex justify-content-end align-items-center">
        <div
          className="d-flex align-items-center gap-1"
          style={{
            color: "#111111",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          <FaStar size={11} color="#54C69D" />
          <span>{Number(product.rating || 4.9).toFixed(1)}</span>
          <span style={{ color: "#666666", fontSize: "10px" }}>
            ({product.reviews || 53})
          </span>
        </div>
      </div>

      <div className="px-2 pt-2">
        <div
          className="overflow-hidden rounded-4"
          style={{ backgroundColor: "#F8FAF9" }}
        >
          <img
            src={
              product.image ||
              "https://via.placeholder.com/400x500?text=JwelStore"
            }
            alt={product.name}
            style={{
              width: "100%",
              height: "clamp(180px, 22vw, 260px)",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
      </div>

      <div className="px-3 pb-3 pt-2">
        <div
          className="small fw-medium"
          style={{
            color: "#666666",
            letterSpacing: "0.02em",
            minHeight: "18px",
          }}
        >
          {variantText || product.category}
        </div>

        <h6
          className="fw-semibold mb-2 mt-2"
          style={{
            color: "#111111",
            lineHeight: "1.4",
            fontSize: "clamp(13px, 1.4vw, 15px)",
            minHeight: "42px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h6>

        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <span
            className="fw-bold"
            style={{
              color: "#111111",
              fontSize: "clamp(16px, 1.5vw, 18px)",
            }}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice > 0 && (
            <span
              className="text-decoration-line-through"
              style={{
                color: "#666666",
                fontSize: "12px",
              }}
            >
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}

          {discount > 0 && (
            <span
              className="fw-semibold"
              style={{
                color: "#54C69D",
                fontSize: "11px",
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {adminActions ? (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn flex-grow-1 fw-bold rounded-pill"
              onClick={() => { onEdit(product); }}
              style={{
                backgroundColor: "#54C69D",
                color: "#111111",
                border: "none",
                height: "42px",
                fontSize: "12px",
              }}
            >
              EDIT
            </button>
            <button
              type="button"
              className="btn flex-grow-1 fw-bold rounded-pill"
              onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                border: "none",
                height: "42px",
                fontSize: "12px",
              }}
            >
              DELETE
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold rounded-pill"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              backgroundColor: product.stock === 0 ? "#d9d9d9" : "#54C69D",
              color: product.stock === 0 ? "#666666" : "#111111",
              border: "none",
              height: "42px",
              fontSize: "12px",
              letterSpacing: "0.02em",
              boxShadow: "none",
            }}
          >
            <span>ADD TO CART</span>
            <FaArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
