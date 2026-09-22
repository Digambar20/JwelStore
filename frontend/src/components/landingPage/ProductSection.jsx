import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import apiClient from "../../utils/apiClient";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("For You");

  const categories = [
    "For You",
    "Jhumkas",
    "Earrings",
    "Necklaces",
    "Rings",
    "Bangles",
    "Bracelets",
    "Pendants",
  ];

  useEffect(() => {
    fetchProducts();

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        fetchProducts();
      }
    };

    const refreshInterval = window.setInterval(fetchProducts, 300000);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "/products";

      if (activeCategory !== "For You") {
        url += `?category=${encodeURIComponent(activeCategory)}`;
      }

      const response = await apiClient.get(url);
      const backendProducts = response.data.products || [];

      setProducts(backendProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setError("Unable to load the latest products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-fluid px-2 px-md-3 px-lg-4 py-4 py-md-5">
      <div className="mb-4 text-center">
        <h2
          className="fw-bold mb-3"
          style={{
            color: "#111111",
            letterSpacing: "0.04em",
            fontSize: "clamp(20px, 2vw, 32px)",
          }}
        >
          BESTSELLERS
        </h2>

        <div
          className="d-flex justify-content-center justify-content-md-center flex-row overflow-x-auto gap-2 gap-md-3 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          <style>{`
            .jwel-category-row::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div
            className="d-flex flex-row gap-2 gap-md-3 jwel-category-row"
            style={{
              minWidth: "max-content",
              margin: "0 auto",
            }}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="btn rounded-pill px-3 px-md-4 py-2 fw-semibold"
                  style={{
                    backgroundColor: isActive ? "#54C69D" : "#FFFFFF",
                    color: "#111111",
                    border: isActive
                      ? "1px solid #54C69D"
                      : "1px solid rgba(84, 198, 157, 0.5)",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(84, 198, 157, 0.2)"
                      : "none",
                    fontSize: "13px",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "#54C69D",
              width: "2.5rem",
              height: "2.5rem",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0" style={{ color: "#666666" }}>
            Loading jewellery...
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          className="alert alert-danger text-center mx-auto"
          style={{ maxWidth: "520px" }}
        >
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-5">
          <h5 className="fw-bold mb-2" style={{ color: "#111111" }}>
            No Products Available
          </h5>
          <p className="mb-0" style={{ color: "#666666" }}>
            No jewellery is available in this category yet.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="row g-3 g-md-4">
          {products.map((product) => (
            <div
              className="col-6 col-md-4 col-lg-3"
              key={product._id || product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
