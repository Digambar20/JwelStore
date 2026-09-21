import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import ProductCard from "../landingPage/ProductCard";

const RelatedProducts = ({ product }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!product?.category) return;
    apiClient
      .get(`/products?category=${product.category}`)
      .then((res) => {
        const filtered = (res.data.products || [])
          .filter((p) => p._id !== product._id)
          .slice(0, 4);
        setRelated(filtered);
      })
      .catch(() => {});
  }, [product]);

  if (!related.length) return null;

  return (
    <div style={{ width: "100%", marginTop: "8px" }}>
      <div style={{ borderTop: "1px solid #eee", paddingTop: "36px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#111", letterSpacing: "0.02em", textAlign: "center", marginBottom: "24px" }}>
          YOU MAY ALSO LIKE
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {related.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/products/${p._id}`)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
