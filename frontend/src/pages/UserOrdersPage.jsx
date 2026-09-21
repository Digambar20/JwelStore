import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/notifications";

const UserOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUserOrders();
  }, [user, navigate]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/orders/user");
      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!(await confirmToast("Cancel this order?"))) {
      return;
    }

    try {
      await apiClient.delete(`/orders/${orderId}`);
      await fetchUserOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "warning",
      Preparing: "info",
      Completed: "success",
      Delivered: "success",
      Cancelled: "danger",
    };
    return (
      <span
        className={`badge bg-${statusColors[status] || "secondary"} rounded-pill px-3 py-2`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container-lg my-5 text-center">
        <div
          className="spinner-border"
          style={{ color: "#54C69D" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container-lg my-4">
      <h2 style={{ color: "#111111", marginBottom: "30px" }}>My Orders</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p className="fs-5">No orders yet</p>
          <p className="text-muted">
            Start shopping and place your first order!
          </p>
          <a
            href="/"
            className="btn"
            style={{ backgroundColor: "#54C69D", color: "#111111" }}
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-lg-12 mb-4">
              <div
                className="card shadow-sm border-0"
                style={{
                  borderLeft: "4px solid #54C69D",
                  borderRadius: "12px",
                }}
              >
                <div className="card-body">
                  {/* Order Header */}
                  <div
                    className="row mb-3 pb-3"
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <div className="col-md-6">
                      <h6 className="text-muted mb-1">Order ID</h6>
                      <p
                        className="fw-bold mb-0"
                        style={{ color: "#111111", fontSize: "14px" }}
                      >
                        #JWEL{order._id.slice(-5).toUpperCase()}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <h6 className="text-muted mb-1">Status</h6>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                    <div className="col-md-3 text-end">
                      <h6 className="text-muted mb-1">Order Date</h6>
                      <p className="small">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">
                      {order.items?.length || 0} Items
                    </span>
                    <strong style={{ color: "#111111" }}>
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {["Pending", "Preparing", "Completed", "Delivered"].map(
                      (step, index) => {
                        const statusOrder = {
                          Pending: 0,
                          Preparing: 1,
                          Completed: 2,
                          Delivered: 3,
                        };
                        const currentStep = statusOrder[order.status] ?? 0;
                        const isComplete = index <= currentStep;
                        return (
                          <span
                            key={step}
                            className="small"
                            style={{
                              color: isComplete ? "#111111" : "#999999",
                            }}
                          >
                            <span
                              style={{
                                color: isComplete ? "#54C69D" : "#BDBDBD",
                              }}
                            >
                              ●
                            </span>{" "}
                            {step === "Pending"
                              ? "Ordered"
                              : step === "Preparing"
                                ? "Confirmed"
                                : step}
                          </span>
                        );
                      },
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Items</h6>
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <div>
                            <p className="mb-0 fw-500">
                              {item.product?.name || "Product"}
                            </p>
                            <p className="small text-muted mb-0">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <p className="fw-bold mb-0">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* Shipping Address */}
                  <div
                    className="mb-3"
                    style={{
                      backgroundColor: "#f8f7f4",
                      padding: "12px",
                      borderRadius: "4px",
                    }}
                  >
                    <h6 className="text-muted mb-2">📍 Delivery Address</h6>
                    <p className="small mb-0">
                      <strong>{order.shippingAddress?.name}</strong>
                    </p>
                    <p className="small mb-0">
                      {order.shippingAddress?.street},{" "}
                      {order.shippingAddress?.city}
                    </p>
                    <p className="small mb-0">
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.zipCode}
                    </p>
                    <p className="small mb-0">
                      📞 {order.shippingAddress?.phone}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div
                    className="row text-end"
                    style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}
                  >
                    <div className="col-md-6 ms-auto">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>
                          ₹{Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span className="text-success">FREE</span>
                      </div>
                      <div
                        className="d-flex justify-content-between fw-bold"
                        style={{ color: "#54C69D" }}
                      >
                        <span>Total:</span>
                        <span>
                          ₹{Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div
                    className="mt-3 pt-3"
                    style={{ borderTop: "1px solid #eee" }}
                  >
                    <small className="text-muted">
                      💳 Payment:{" "}
                      <strong>{order.paymentMethod || "Not specified"}</strong>
                    </small>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill"
                      style={{ border: "1px solid #D9534F", color: "#D9534F" }}
                      disabled={["Delivered", "Cancelled", "Refunded"].includes(
                        order.status,
                      )}
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
