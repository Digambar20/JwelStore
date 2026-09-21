import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import {
  FaBars,
  FaSearch,
  FaWhatsapp,
  FaUser,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = () => {
  const { user, admin, logoutUser, logoutAdmin } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
    } else {
      logoutUser();
    }
    navigate("/");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="jwel-navbar">
        <div className="jwel-navbar-container">
          {/* ================= LEFT ================= */}
          <div className="jwel-left">
            {/* Mobile Menu */}
            <button
              className="jwel-menu-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#jwelMobileMenu"
            >
              <FaBars />
            </button>

            {/* Logo */}
            <Link to="/" className="jwel-logo">
              <span>Jwel</span>
              <span>Store</span>
            </Link>
          </div>

          {/* ================= DESKTOP SEARCH ================= */}
          <form
            className="jwel-search jwel-desktop-search"
            onSubmit={handleSearch}
          >
            <FaSearch />

            <input
              type="text"
              placeholder="Search For Products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* ================= RIGHT ICONS ================= */}
          <div className="jwel-right">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919322875503"
              target="_blank"
              rel="noreferrer"
              className="jwel-icon"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            {/* User */}
            {user || admin ? (
              <Link
                to={admin ? "/admin" : "/profile"}
                className="jwel-icon"
                title={admin ? "Admin Dashboard" : "My Account"}
              >
                <FaUser />
              </Link>
            ) : (
              <Link to="/login" className="jwel-icon" title="Login">
                <FaUser />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="jwel-icon jwel-cart" title="Cart">
              <FaShoppingCart />

              {cart.length > 0 && (
                <span className="jwel-cart-count">{cart.length}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        <div className="jwel-mobile-search-wrapper">
          <form
            className="jwel-search jwel-mobile-search"
            onSubmit={handleSearch}
          >
            <FaSearch />

            <input
              type="text"
              placeholder="Search For Products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className="offcanvas offcanvas-start jwel-offcanvas"
        tabIndex="-1"
        id="jwelMobileMenu"
      >
        <div className="offcanvas-header">
          <Link
            to="/"
            className="jwel-sidebar-logo"
            data-bs-dismiss="offcanvas"
          >
            JwelStore
          </Link>

          <button
            type="button"
            className="jwel-close-btn"
            data-bs-dismiss="offcanvas"
          >
            <FaTimes />
          </button>
        </div>

        <div className="offcanvas-body">
          <Link
            to="/"
            className="jwel-sidebar-link"
            data-bs-dismiss="offcanvas"
            onClick={() => navigate("/")}
          >
            Home
          </Link>

          <Link
            to="/products"
            className="jwel-sidebar-link"
            data-bs-dismiss="offcanvas"
            onClick={() => navigate("/products")}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="jwel-sidebar-link"
            data-bs-dismiss="offcanvas"
            onClick={() => navigate("/cart")}
          >
            Cart
          </Link>

          <Link
            to={admin ? "/admin" : user ? "/profile" : "/login"}
            className="jwel-sidebar-link"
            data-bs-dismiss="offcanvas"
            onClick={() =>
              navigate(admin ? "/admin" : user ? "/profile" : "/login")
            }
          >
            {admin ? "Admin Dashboard" : user ? "Profile" : "Login"}
          </Link>

          {admin && (
            <>
              <Link
                to="/admin?tab=products"
                className="jwel-sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/admin?tab=products")}
              >
                Products
              </Link>
              <Link
                to="/admin?tab=orders"
                className="jwel-sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/admin?tab=orders")}
              >
                Orders
              </Link>
              <Link
                to="/admin?tab=sales"
                className="jwel-sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/admin?tab=sales")}
              >
                Sales &amp; Analytics
              </Link>
              <button
                type="button"
                className="jwel-sidebar-link text-start border-0 bg-transparent w-100"
                onClick={handleLogout}
                data-bs-dismiss="offcanvas"
              >
                Logout
              </button>
            </>
          )}

          {user && !admin && (
            <>
              <Link
                to="/orders"
                className="jwel-sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/orders")}
              >
                My Orders
              </Link>
              <Link
                to="/profile#addresses"
                className="jwel-sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/profile#addresses")}
              >
                Addresses
              </Link>
              <button
                type="button"
                className="jwel-sidebar-link text-start border-0 bg-transparent w-100"
                onClick={handleLogout}
                data-bs-dismiss="offcanvas"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
