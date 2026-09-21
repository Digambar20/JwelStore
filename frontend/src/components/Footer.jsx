import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="jwel-footer mt-auto">
      <div className="container-fluid px-4 px-md-5 py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link to="/" className="jwel-footer-brand">
              <span>Jwel</span>Store
            </Link>
            <p className="jwel-footer-copy mt-3 mb-0">
              Thoughtfully selected jewellery for everyday elegance and
              meaningful moments.
            </p>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="jwel-footer-title">Explore</h6>
            <Link to="/" className="jwel-footer-link">
              Home
            </Link>
            <Link to="/products" className="jwel-footer-link">
              Products
            </Link>
            <Link to="/cart" className="jwel-footer-link">
              Cart
            </Link>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="jwel-footer-title">Account</h6>
            <Link to="/profile" className="jwel-footer-link">
              My Account
            </Link>
            <Link to="/orders" className="jwel-footer-link">
              My Orders
            </Link>
            <Link to="/login" className="jwel-footer-link">
              Login
            </Link>
          </div>

          <div className="col-lg-4">
            <h6 className="jwel-footer-title">Contact</h6>
            <div className="jwel-footer-contact">
              <FaEnvelope /> jwelstore.orders@gmail.com
            </div>
            <div className="jwel-footer-contact">
              <FaPhoneAlt /> +91 93228 75503
            </div>
            <a
              href="https://wa.me/919322875503"
              target="_blank"
              rel="noreferrer"
              className="jwel-footer-contact"
              style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FaWhatsapp color="#25D366" /> Chat on WhatsApp
            </a>
            <div className="jwel-footer-contact">
              <FaMapMarkerAlt /> Nagpur, Maharashtra
            </div>
          </div>
        </div>

        <div className="jwel-footer-bottom mt-5 pt-3">
          <span>
            © {new Date().getFullYear()} JwelStore. All rights reserved.
          </span>
          <span>Secure shopping · Made for jewellery lovers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
