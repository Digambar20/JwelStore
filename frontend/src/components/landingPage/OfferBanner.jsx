import React from "react";

import banner1 from "../../assets/jhumka-banner-1.png";
import banner2 from "../../assets/jhumka-banner-2.png";

const OfferBanner = () => {
  return (
    <section className="container-fluid px-2 px-md-3 px-lg-4 pt-2 pt-md-3">
      <div
        id="jwelStoreCarousel"
        className="carousel slide shadow-sm rounded-4 overflow-hidden"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >

        {/* Indicators */}
        <div className="carousel-indicators">

          <button
            type="button"
            data-bs-target="#jwelStoreCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />

          <button
            type="button"
            data-bs-target="#jwelStoreCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          />

        </div>

        {/* Slides */}
        <div className="carousel-inner">

          {/* Banner 1 */}
          <div className="carousel-item active">
            <img
              src={banner1}
              className="d-block w-100"
              alt="Jhumka Combo Collection"
              style={{
                height: "clamp(210px, 38vw, 520px)",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Banner 2 */}
          <div className="carousel-item">
            <img
              src={banner2}
              className="d-block w-100"
              alt="Jhumka Gift Box Collection"
              style={{
                height: "clamp(210px, 38vw, 520px)",
                objectFit: "cover",
              }}
            />
          </div>

        </div>

        {/* Previous */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#jwelStoreCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          />

          <span className="visually-hidden">
            Previous
          </span>
        </button>

        {/* Next */}
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#jwelStoreCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          />

          <span className="visually-hidden">
            Next
          </span>
        </button>

      </div>
    </section>
  );
};

export default OfferBanner;