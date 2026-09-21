import React, { useState } from "react";

const ProductGallery = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const allImages = images?.length ? images : [null];

  return (
    <>
      {/* Main Image */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            maxWidth: "520px",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#F8FAF9",
            cursor: "zoom-in",
            boxShadow: "0 8px 32px rgba(17,17,17,0.10)",
            aspectRatio: "1 / 1",
          }}
        >
          <img
            src={allImages[activeIdx] || "https://via.placeholder.com/520?text=JwelStore"}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "14px", overflowX: "auto", padding: "4px 0" }}>
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
                border: activeIdx === i ? "2.5px solid #54C69D" : "2px solid transparent",
                boxShadow: activeIdx === i ? "0 2px 10px rgba(84,198,157,0.25)" : "0 1px 4px rgba(17,17,17,0.08)",
                transition: "border 0.2s",
                backgroundColor: "#F8FAF9",
              }}
            >
              <img
                src={img || "https://via.placeholder.com/64?text=+"}
                alt={`${name} ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <button
            onClick={() => setModalOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "none", border: "none", color: "#fff",
              fontSize: "32px", cursor: "pointer", lineHeight: 1,
            }}
          >
            ×
          </button>
          <img
            src={allImages[activeIdx] || "https://via.placeholder.com/800?text=JwelStore"}
            alt={name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "88vh",
              borderRadius: "16px", objectFit: "contain",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProductGallery;
