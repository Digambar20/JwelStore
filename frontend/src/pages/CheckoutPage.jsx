import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [placingOrder, setPlacingOrder] = useState(false);
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  // const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Check if user has saved addresses
  const savedAddresses = user?.savedAddresses || [];
  const hasAddresses = savedAddresses.length > 0;

  // If user has saved addresses, default to using one
  useEffect(() => {
    if (hasAddresses && useNewAddress) {
      setUseNewAddress(false);
      setSelectedAddressIndex(0);
    }
  }, []);

  // Update addressData when selecting a saved address
  useEffect(() => {
    if (user) {
      setAddressData({
        name: user.name || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
      });
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning"></div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="container-lg my-5">
        <div className="alert alert-warning">
          <h4>🔐 Please Login First</h4>
          <p>You need to be logged in to proceed with checkout.</p>
          <button
            className="btn"
            style={{
              backgroundColor: "#d4af37",
              color: "#1a1a1a",
            }}
            onClick={() =>
              navigate("/login", {
                state: {
                  from: location.pathname,
                },
              })
            }
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="container-lg my-5">
        <div className="alert alert-info">
          <h4>🛒 Your cart is empty</h4>
          <button
            className="btn"
            style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
            onClick={() => navigate("/")}
          >
            🛍 Continue Shopping
          </button>
          <button
            className="btn btn-outline-dark ms-2"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: addressData,
        paymentMethod,
      };

      const response = await apiClient.post("/orders", orderData);
      setOrderPlaced(response.data.order);
      setStep(3);
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container-lg my-4">
      {/* Progress Steps */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-center flex-grow-1">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: step >= 1 ? "#d4af37" : "#eee",
                color: step >= 1 ? "#1a1a1a" : "#999",
                fontWeight: "bold",
              }}
            >
              1
            </div>
            <p className="small mt-2">Address</p>
          </div>
          <div
            style={{
              flex: 1,
              height: "2px",
              backgroundColor: step >= 2 ? "#d4af37" : "#eee",
            }}
          ></div>
          <div className="text-center flex-grow-1">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: step >= 2 ? "#d4af37" : "#eee",
                color: step >= 2 ? "#1a1a1a" : "#999",
                fontWeight: "bold",
              }}
            >
              2
            </div>
            <p className="small mt-2">Payment</p>
          </div>
          <div
            style={{
              flex: 1,
              height: "2px",
              backgroundColor: step >= 3 ? "#d4af37" : "#eee",
            }}
          ></div>
          <div className="text-center flex-grow-1">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: step >= 3 ? "#d4af37" : "#eee",
                color: step >= 3 ? "#1a1a1a" : "#999",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>
            <p className="small mt-2">Confirmation</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          {/* Step 1: Address */}
          {step === 1 && (
            <div
              className="card shadow-sm mb-4"
              style={{ borderLeft: "4px solid #d4af37" }}
            >
              <div className="card-body">
                <h5 className="card-title mb-4">📍 Delivery Address</h5>

                {/* Saved Addresses Section */}
                {hasAddresses && (
                  <div
                    className="mb-4 pb-4"
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <h6 className="mb-3">💾 Saved Addresses</h6>
                    {savedAddresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded mb-2 cursor-pointer ${
                          !useNewAddress && selectedAddressIndex === idx
                            ? "border-warning"
                            : ""
                        }`}
                        style={{
                          borderColor:
                            !useNewAddress && selectedAddressIndex === idx
                              ? "#d4af37"
                              : "#ddd",
                          backgroundColor:
                            !useNewAddress && selectedAddressIndex === idx
                              ? "#fff9e6"
                              : "white",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setUseNewAddress(false);
                          setSelectedAddressIndex(idx);
                        }}
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="address"
                            id={`addr-${idx}`}
                            checked={
                              !useNewAddress && selectedAddressIndex === idx
                            }
                            onChange={() => {
                              setUseNewAddress(false);
                              setSelectedAddressIndex(idx);
                            }}
                          />
                          <label
                            className="form-check-label w-100"
                            htmlFor={`addr-${idx}`}
                          >
                            <p className="mb-1 fw-semibold">
                              {addr.street}, {addr.city}
                            </p>
                            <p className="small text-muted mb-0">
                              {addr.state} - {addr.zipCode}
                              {addr.isDefault && (
                                <span className="badge bg-success ms-2">
                                  Default
                                </span>
                              )}
                            </p>
                          </label>
                        </div>
                      </div>
                    ))}

                    <div
                      className={`p-3 border rounded ${
                        useNewAddress ? "border-warning" : ""
                      }`}
                      style={{
                        borderColor: useNewAddress ? "#d4af37" : "#ddd",
                        backgroundColor: useNewAddress ? "#fff9e6" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setUseNewAddress(true)}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="new-addr"
                          checked={useNewAddress}
                          onChange={() => setUseNewAddress(true)}
                        />
                        <label className="form-check-label" htmlFor="new-addr">
                          ➕ Enter a new address
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={addressData.name}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="street"
                    placeholder="House No., Building Name"
                    value={addressData.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Zip Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipCode"
                    value={addressData.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/cart")}
                  >
                    Back to Cart
                  </button>
                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div
              className="card shadow-sm mb-4"
              style={{ borderLeft: "4px solid #d4af37" }}
            >
              <div className="card-body">
                <h5 className="card-title mb-4">💳 Select Payment Method</h5>

                <div className="mb-3">
                  <div
                    className={`p-3 border rounded mb-3 cursor-pointer ${
                      paymentMethod === "COD" ? "border-warning" : ""
                    }`}
                    style={{
                      borderColor: paymentMethod === "COD" ? "#d4af37" : "#ddd",
                      backgroundColor:
                        paymentMethod === "COD" ? "#fff9e6" : "white",
                      cursor: "pointer",
                    }}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id="cod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label fw-bold" htmlFor="cod">
                        💵 Cash on Delivery
                      </label>
                      <p className="small text-muted mt-2">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded mb-3 cursor-pointer`}
                    style={{
                      borderColor:
                        paymentMethod === "Credit Card" ? "#d4af37" : "#ddd",
                      backgroundColor:
                        paymentMethod === "Credit Card" ? "#fff9e6" : "white",
                      cursor: "pointer",
                      opacity: 0.6,
                    }}
                    onClick={() =>
                      toast("Payment gateway coming soon", { icon: "i" })
                    }
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id="credit"
                        value="Credit Card"
                        disabled
                      />
                      <label
                        className="form-check-label fw-bold"
                        htmlFor="credit"
                      >
                        💳 Credit/Debit Card
                      </label>
                      <p className="small text-muted mt-2">Coming Soon</p>
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded mb-3 cursor-pointer`}
                    style={{
                      borderColor: paymentMethod === "UPI" ? "#d4af37" : "#ddd",
                      backgroundColor:
                        paymentMethod === "UPI" ? "#fff9e6" : "white",
                      cursor: "pointer",
                      opacity: 0.6,
                    }}
                    onClick={() =>
                      toast("Payment gateway coming soon", { icon: "i" })
                    }
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id="upi"
                        value="UPI"
                        disabled
                      />
                      <label className="form-check-label fw-bold" htmlFor="upi">
                        📱 UPI (Google Pay, PhonePe, Paytm)
                      </label>
                      <p className="small text-muted mt-2">Coming Soon</p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info">
                  <strong>ℹ️ Note:</strong> Currently only Cash on Delivery is
                  available. Other payment methods coming soon!
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back to Address
                  </button>
                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div
              className="card shadow-sm mb-4"
              style={{ borderLeft: "4px solid #28a745", borderRadius: "8px" }}
            >
              <div className="card-body text-center py-5">
                <div style={{ fontSize: "5rem", marginBottom: "20px" }}>
                  ✨🎉✨
                </div>
                <h2
                  className="mb-2"
                  style={{ color: "#28a745", fontWeight: "700" }}
                >
                  Thank You, {user.name}!
                </h2>
                <h4 className="mb-3" style={{ color: "#1a1a1a" }}>
                  Your Order Has Been Placed Successfully! 🎁
                </h4>
                <p className="text-muted fs-5 mb-4">
                  We're preparing your beautiful jewelry items for shipment.
                  You'll receive a confirmation email and tracking details soon.
                </p>

                {orderPlaced && (
                  <div className="alert alert-light border border-success mb-4">
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <p className="mb-1 text-muted small">ORDER ID</p>
                        <p
                          className="mb-0 fw-bold fs-5"
                          style={{ color: "#d4af37" }}
                        >
                          #{orderPlaced._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1 text-muted small">TOTAL AMOUNT</p>
                        <p
                          className="mb-0 fw-bold fs-5"
                          style={{ color: "#d4af37" }}
                        >
                          ₹{orderPlaced.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <hr style={{ borderColor: "#d4af37", opacity: 0.3 }} />
                    <p className="mb-0 small">
                      <strong>Payment Method:</strong>{" "}
                      {orderPlaced.paymentMethod}
                    </p>
                  </div>
                )}

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    className="btn btn-lg text-white"
                    style={{
                      backgroundColor: "#d4af37",
                      color: "#1a1a1a",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/orders")}
                  >
                    📦 View Your Orders
                  </button>
                  <button
                    className="btn btn-lg btn-outline-secondary"
                    onClick={() => navigate("/")}
                  >
                    🛍️ Continue Shopping
                  </button>
                </div>

                <p className="text-muted small mt-4">
                  Check your email ({user.email}) for order confirmation and
                  updates
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div
            className="card shadow-sm sticky-top"
            style={{
              top: "80px",
              zIndex: 10,
              borderTop: "2px solid #d4af37",
            }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">📦 Order Summary</h5>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: "15px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between mb-2 pb-2 border-bottom"
                  >
                    <div>
                      <p className="small mb-0">{item.name}</p>
                      <p className="small text-muted mb-0">x{item.quantity}</p>
                    </div>
                    <p className="small fw-bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: "#d4af37" }} />

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
              </div>

              <hr style={{ borderColor: "#d4af37" }} />

              <div
                className="d-flex justify-content-between fw-bold fs-5"
                style={{ color: "#1a1a1a" }}
              >
                <span>Total:</span>
                <span style={{ color: "#d4af37" }}>
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>

              {step === 1 && (
                <div className="alert alert-warning small mt-3 mb-0">
                  <strong>⚠️ Note:</strong> Please fill your address details to
                  proceed.
                </div>
              )}

              {step === 2 && (
                <div className="alert alert-info small mt-3 mb-0">
                  <strong>ℹ️ Info:</strong> Select a payment method and click
                  "Place Order".
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
