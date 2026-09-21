import React, { useState } from "react";

const Row = ({ label, value }) =>
  value ? (
    <div style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ minWidth: "140px", fontSize: "13px", color: "#888", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#111" }}>{value}</span>
    </div>
  ) : null;

const ProductDetails = ({ product }) => {
  const [open, setOpen] = useState(true);

  const specs = [
    { label: "Material", value: product.material },
    { label: "Weight", value: product.weight },
    { label: "Category", value: product.category },
    { label: "Occasion", value: product.occasion },
    { label: "Colour", value: product.colour },
    { label: "Jewellery Type", value: product.jewelleryType },
  ].filter((s) => s.value);

  const hasSpecs = specs.length > 0;
  const hasCare = !!product.careInstructions;

  if (!hasSpecs && !hasCare && !product.description) return null;

  return (
    <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto" }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", borderBottom: open ? "none" : "1px solid #eee",
        }}
      >
        <span style={{ fontSize: "17px", fontWeight: 700, color: "#111", letterSpacing: "0.02em" }}>
          PRODUCT DETAILS
        </span>
        <span style={{ fontSize: "20px", color: "#54C69D", fontWeight: 700 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ paddingBottom: "8px" }}>
          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, margin: 0 }}>{product.description}</p>
            </div>
          )}

          {/* Specs */}
          {hasSpecs && (
            <div style={{ marginBottom: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: "4px" }}>SPECIFICATIONS</p>
              {specs.map((s) => <Row key={s.label} label={s.label} value={s.value} />)}
            </div>
          )}

          {/* Care */}
          {hasCare && (
            <div style={{ marginTop: "16px", backgroundColor: "#F8FAF9", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: "6px" }}>CARE INSTRUCTIONS</p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.7, margin: 0 }}>{product.careInstructions}</p>
            </div>
          )}

          {/* Default care if none provided */}
          {!hasCare && (
            <div style={{ marginTop: "16px", backgroundColor: "#F8FAF9", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: "6px" }}>CARE INSTRUCTIONS</p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.7, margin: 0 }}>
                Keep away from moisture, perfume and chemicals. Store in a dry place. Clean gently with a soft cloth.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
