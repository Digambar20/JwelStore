import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDetails from "../components/product/ProductDetails";
import ProductReviews from "../components/product/ProductReviews";
import RelatedProducts from "../components/product/RelatedProducts";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    apiClient
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #f0f0f0", borderTop: "3px solid #54C69D", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#888", fontSize: "14px" }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ color: "#666", fontSize: "16px" }}>{error || "Product not found."}</p>
        <button
          onClick={() => navigate("/products")}
          style={{ padding: "10px 28px", backgroundColor: "#54C69D", border: "none", borderRadius: "50px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Build images array: use product.images if available, else fallback to product.image
  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return (
    <div style={{ backgroundColor: "#F8FAF9", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 20px 0" }}>
        <nav style={{ fontSize: "13px", color: "#888" }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#54C69D" }}>Home</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span onClick={() => navigate("/products")} style={{ cursor: "pointer", color: "#54C69D" }}>Products</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#111" }}>{product.name}</span>
        </nav>
      </div>

      {/* Page Title */}
      <div style={{ textAlign: "center", padding: "24px 20px 8px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#54C69D", margin: "0 0 4px" }}>
          PRODUCT DETAILS
        </p>
      </div>

      {/* Main Content — centered column */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>

        {/* 1 & 2: Gallery + Thumbnails */}
        <div style={{ width: "100%" }}>
          <ProductGallery images={images} name={product.name} />
        </div>

        {/* Divider */}
        <div style={{ width: "60px", height: "3px", backgroundColor: "#54C69D", borderRadius: "2px" }} />

        {/* 3–14: Product Info */}
        <div style={{ width: "100%" }}>
          <ProductInfo product={product} />
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", backgroundColor: "#eee" }} />

        {/* 15–17: Product Details + Specs + Care */}
        <div style={{ width: "100%" }}>
          <ProductDetails product={product} />
        </div>

        {/* 18: Reviews */}
        <div style={{ width: "100%" }}>
          <ProductReviews product={product} />
        </div>

        {/* 19: Similar Products */}
        <div style={{ width: "100%" }}>
          <RelatedProducts product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
