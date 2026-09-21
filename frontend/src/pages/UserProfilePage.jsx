import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import UserOrdersPage from "./UserOrdersPage";

const UserProfilePage = () => {
  const { user, updateUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  if (!user) {
    return (
      <div className="container-lg my-5">
        <div className="alert alert-warning">
          <h4>🔐 Please Login First</h4>
          <p>You need to be logged in to view your profile.</p>
          <button
            className="btn"
            style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await apiClient.put("/auth/user/profile", {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      });
      // Update the global user context
      updateUser(response.data.user);
      setMessage("✅ Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Failed to update profile"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="container-lg my-4">
      <h2 className="mb-4" style={{ color: "#111111" }}>
        My Account
      </h2>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-2 d-flex flex-row align-items-center gap-2 overflow-auto">
              <button
                type="button"
                className="btn rounded px-3 py-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    activeSection === "profile" ? "#54C69D" : "#FFFFFF",
                  color: "#111111",
                  border: "1px solid rgba(84, 198, 157, 0.5)",
                }}
                onClick={() => setActiveSection("profile")}
              >
                Profile
              </button>
              <button
                type="button"
                className="btn rounded px-3 py-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    activeSection === "orders" ? "#54C69D" : "#FFFFFF",
                  color: "#111111",
                  border: "1px solid rgba(84, 198, 157, 0.5)",
                }}
                onClick={() => setActiveSection("orders")}
              >
                My Orders
              </button>
              <button
                type="button"
                className="btn rounded px-3 py-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    activeSection === "addresses" ? "#54C69D" : "#FFFFFF",
                  color: "#111111",
                  border: "1px solid rgba(84, 198, 157, 0.5)",
                }}
                onClick={() => setActiveSection("addresses")}
              >
                Addresses
              </button>
              <button
                type="button"
                className="btn rounded px-3 py-2 flex-shrink-0"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#111111",
                  border: "1px solid rgba(84, 198, 157, 0.5)",
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {activeSection === "profile" && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="mb-3" style={{ color: "#111111" }}>
                  Profile
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="small text-muted">Name</div>
                    <div className="fw-semibold">{user.name || "Customer"}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-muted">Email</div>
                    <div className="fw-semibold">{user.email}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-muted">Mobile number</div>
                    <div className="fw-semibold">
                      {user.phone || "Phone number not added"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "orders" && <UserOrdersPage />}

          {/* Personal Information Section */}
          <div
            className="card shadow-sm mb-4"
            style={{ borderLeft: "4px solid #d4af37", display: "none" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">📋 Personal Information</h5>
                <button
                  className={`btn btn-sm ${editing ? "btn-secondary" : "btn-outline-primary"}`}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              {editing && (
                <button
                  className="btn text-white fw-semibold"
                  style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div
            className="card shadow-sm mb-4"
            id="addresses"
            style={{
              borderLeft: "4px solid #d4af37",
              display: activeSection === "addresses" ? undefined : "none",
            }}
          >
            <div className="card-body">
              <h5 className="card-title mb-4">📍 Saved Addresses</h5>

              {user?.savedAddresses && user.savedAddresses.length > 0 ? (
                <div>
                  {user.savedAddresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded mb-3"
                      style={{
                        backgroundColor: "#f8f7f4",
                        borderColor: "#d4af37",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold">
                            {addr.street}
                            {addr.isDefault && (
                              <span className="badge bg-success ms-2">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="small text-muted mb-0">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">
                  <p className="mb-0">
                    No saved addresses yet. Your first order address will be
                    saved here.
                  </p>
                </div>
              )}

              <p className="text-muted small mt-3">
                💡 Tip: Your addresses are automatically saved from your orders
                and can be reused during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="col-lg-4" style={{ display: "none" }}>
          <div
            className="card shadow-sm sticky-top"
            style={{ top: "100px", borderTop: "2px solid #d4af37" }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">Account Details</h5>

              <div
                className="mb-3 pb-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <p className="text-muted small mb-1">Name</p>
                <p className="fw-semibold">{formData.name}</p>
              </div>

              <div
                className="mb-3 pb-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <p className="text-muted small mb-1">Email</p>
                <p className="fw-semibold">{user.email}</p>
              </div>

              <div
                className="mb-3 pb-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <p className="text-muted small mb-1">Phone</p>
                <p className="fw-semibold">
                  {formData.phone || "Not provided"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-muted small mb-1">Saved Addresses</p>
                <p className="fw-semibold small">
                  {user?.savedAddresses?.length || 0} address(es)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
