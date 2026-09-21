import React from "react";
import OfferBanner from "../components/landingPage/OfferBanner";
import ProductSection from "../components/landingPage/ProductSection";

const HomePage = () => {
  return (
    <main className="bg-light min-vh-100">
      <OfferBanner />
      <ProductSection />
    </main>
  );
};

export default HomePage;
