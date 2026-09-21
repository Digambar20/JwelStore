import React from "react";
import { FaStar } from "react-icons/fa";

const sampleReviews = [
  { id: 1, name: "Priya S.", rating: 5, text: "Beautiful product and exactly as shown. The quality is amazing!", date: "Dec 2024", verified: true },
  { id: 2, name: "Anita M.", rating: 5, text: "Loved it! Perfect for festive occasions. Fast delivery too.", date: "Nov 2024", verified: true },
  { id: 3, name: "Kavya R.", rating: 4, text: "Very elegant design. Looks premium in person.", date: "Oct 2024", verified: false },
];

const StarRow = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1,2,3,4,5].map((s) => (
      <FaStar key={s} size={12} color={s <= rating ? "#54C69D" : "#ddd"} />
    ))}
  </div>
);

const ProductReviews = ({ product }) => {
  const totalReviews = product.reviews || 0;
  const avgRating = Number(product.rating || 5).toFixed(1);
  const displayReviews = totalReviews > 0 ? sampleReviews : [];

  return (
    <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ borderTop: "1px solid #eee", paddingTop: "32px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#111", letterSpacing: "0.02em", marginBottom: "20px" }}>
          CUSTOMER REVIEWS
        </h2>

        {/* Summary */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", backgroundColor: "#F8FAF9", borderRadius: "14px", padding: "18px 20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "42px", fontWeight: 800, color: "#111", lineHeight: 1 }}>{avgRating}</div>
            <StarRow rating={Math.round(product.rating || 5)} />
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{totalReviews} Reviews</div>
          </div>
          <div style={{ flex: 1, paddingLeft: "16px", borderLeft: "1px solid #e0e0e0" }}>
            {[5,4,3,2,1].map((star) => {
              const pct = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#666", width: "8px" }}>{star}</span>
                  <FaStar size={10} color="#54C69D" />
                  <div style={{ flex: 1, height: "6px", backgroundColor: "#e8e8e8", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${totalReviews > 0 ? pct : 0}%`, height: "100%", backgroundColor: "#54C69D", borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#888", width: "28px" }}>{totalReviews > 0 ? `${pct}%` : "0%"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Cards */}
        {displayReviews.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {displayReviews.map((r) => (
              <div key={r.id} style={{ backgroundColor: "#fff", border: "1px solid #f0f0f0", borderRadius: "14px", padding: "16px 18px", boxShadow: "0 2px 8px rgba(17,17,17,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{r.name}</div>
                    <StarRow rating={r.rating} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#aaa" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.6, margin: "8px 0 6px" }}>"{r.text}"</p>
                {r.verified && (
                  <span style={{ fontSize: "11px", color: "#54C69D", fontWeight: 600 }}>✓ Verified Purchase</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa", fontSize: "14px" }}>
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
