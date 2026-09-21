import React, { useEffect, useMemo, useState } from "react";
import { FaEye, FaPrint, FaSearch, FaTimes } from "react-icons/fa";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/notifications";

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

const paymentStatuses = ["Paid", "Pending", "Failed", "COD", "Refunded"];

const statusColors = {
  Pending: "#F3B33D",
  Confirmed: "#4F8EDC",
  Packed: "#8B6FC4",
  Preparing: "#4F8EDC",
  Shipped: "#E58B43",
  "Out for Delivery": "#E58B43",
  Delivered: "#54C69D",
  Cancelled: "#D9534F",
  Returned: "#777777",
  Refunded: "#555555",
};

const formatOrderId = (id) => `#JWEL${String(id).slice(-5).toUpperCase()}`;
const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const StatusBadge = ({ value }) => (
  <span
    className="badge rounded-pill px-3 py-2"
    style={{
      backgroundColor: statusColors[value] || "#777777",
      color: "#111111",
    }}
  >
    {value || "Pending"}
  </span>
);

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [date, setDate] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        status: activeStatus !== "All" ? activeStatus : status,
        paymentStatus,
        date,
        page: String(page),
        limit: "20",
      });
      const response = await apiClient.get(
        `/orders/admin/all?${params.toString()}`,
      );
      setOrders(response.data.orders || []);
      setSummary(
        response.data.summary || {
          total: 0,
          pending: 0,
          shipped: 0,
          delivered: 0,
        },
      );
      setPagination(response.data.pagination || { total: 0, limit: 20 });
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, status, paymentStatus, date, activeStatus, page]);

  const totalPages = Math.max(
    1,
    Math.ceil((pagination.total || 0) / pagination.limit),
  );
  const visibleTimeline = useMemo(
    () => [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ],
    [],
  );

  const updateStatus = async (orderId, nextStatus) => {
    try {
      setSaving(true);
      await apiClient.put(`/orders/${orderId}/status`, { status: nextStatus });
      await fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((current) => ({ ...current, status: nextStatus }));
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to update order status",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!(await confirmToast("Cancel this order?"))) return;
    try {
      setSaving(true);
      await apiClient.delete(`/orders/admin/${orderId}`);
      setSelectedOrder(null);
      await fetchOrders();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to cancel order",
      );
    } finally {
      setSaving(false);
    }
  };

  const printInvoice = (order) => {
    const popup = window.open("", "_blank", "width=800,height=900");
    if (!popup) return;
    const items = (order.items || [])
      .map(
        (item) =>
          `<tr><td>${item.product?.name || "Product"}</td><td>${item.quantity}</td><td>${formatCurrency(item.price)}</td><td>${formatCurrency(item.quantity * item.price)}</td></tr>`,
      )
      .join("");
    popup.document.write(
      `<html><head><title>${formatOrderId(order._id)} Invoice</title><style>body{font-family:Arial;padding:32px;color:#111}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border-bottom:1px solid #ddd;padding:10px;text-align:left}h1{color:#267b61}</style></head><body><h1>JwelStore</h1><p>Order: ${formatOrderId(order._id)}<br>Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p><p><strong>${order.user?.name || order.shippingAddress?.name || "Customer"}</strong><br>${order.user?.email || ""}<br>${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}</p><table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>${items}</tbody></table><h2>Total: ${formatCurrency(order.totalAmount)}</h2><p>Payment: ${order.paymentStatus || order.paymentMethod || "Pending"}</p><script>window.print()</script></body></html>`,
    );
    popup.document.close();
  };

  const renderOrderActions = (order) => (
    <div className="d-flex gap-2 flex-wrap">
      <button
        className="btn btn-sm rounded-pill"
        style={{ backgroundColor: "#54C69D", color: "#111111" }}
        onClick={() => setSelectedOrder(order)}
      >
        <FaEye className="me-1" /> View
      </button>
      <button
        className="btn btn-sm rounded-pill"
        style={{ border: "1px solid #54C69D" }}
        onClick={() => printInvoice(order)}
      >
        <FaPrint className="me-1" /> Print
      </button>
    </div>
  );

  return (
    <section>
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <p
            className="text-uppercase small fw-semibold mb-1"
            style={{ color: "#54C69D" }}
          >
            Operations
          </p>
          <h2 className="mb-1" style={{ color: "#111111" }}>
            Orders
          </h2>
          <p className="mb-0" style={{ color: "#666666" }}>
            Review, filter, and manage customer orders.
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Orders", value: summary.total },
          { label: "Pending", value: summary.pending },
          { label: "Shipped", value: summary.shipped },
          { label: "Delivered", value: summary.delivered },
        ].map((card) => (
          <div className="col-6 col-lg-3" key={card.label}>
            <div
              className="card border-0 h-100 shadow-sm p-3"
              style={{ borderTop: "3px solid #54C69D" }}
            >
              <div className="small text-uppercase text-muted fw-semibold">
                {card.label}
              </div>
              <div className="fs-3 fw-bold mt-2">
                {card.value.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm p-3 mb-3">
        <div className="row g-2">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                className="form-control"
                placeholder="Search order ID, customer, email, phone"
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-sm-4 col-lg-2">
            <select
              className="form-select"
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
            >
              <option value="All">Order Status</option>
              {orderStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-4 col-lg-2">
            <select
              className="form-select"
              value={paymentStatus}
              onChange={(event) => {
                setPage(1);
                setPaymentStatus(event.target.value);
              }}
            >
              <option value="All">Payment Status</option>
              {paymentStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-4 col-lg-2">
            <select
              className="form-select"
              value={date}
              onChange={(event) => {
                setPage(1);
                setDate(event.target.value);
              }}
            >
              <option value="All">Date</option>
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="d-flex flex-row gap-2 overflow-auto pb-2 mb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {["All", ...orderStatuses].map((item) => (
          <button
            key={item}
            className="btn rounded-pill flex-shrink-0"
            style={{
              backgroundColor: activeStatus === item ? "#54C69D" : "#FFFFFF",
              color: "#111111",
              border: "1px solid rgba(84,198,157,.5)",
            }}
            onClick={() => {
              setPage(1);
              setActiveStatus(item);
            }}
          >
            {item === "All" ? "All Orders" : item}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#54C69D" }} />
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm d-none d-lg-block">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{ backgroundColor: "#F8FAF9" }}>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-semibold">
                        {formatOrderId(order._id)}
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {order.user?.name ||
                            order.shippingAddress?.name ||
                            "Customer"}
                        </div>
                        <div className="small text-muted">
                          {order.user?.email || ""}
                        </div>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="fw-semibold">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td>
                        {order.paymentStatus ||
                          order.paymentMethod ||
                          "Pending"}
                      </td>
                      <td>
                        <StatusBadge value={order.status} />
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>{renderOrderActions(order)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-lg-none d-grid gap-3">
            {orders.map((order) => (
              <div className="card border-0 shadow-sm p-3" key={order._id}>
                <div className="d-flex justify-content-between gap-2">
                  <strong>{formatOrderId(order._id)}</strong>
                  <StatusBadge value={order.status} />
                </div>
                <div className="mt-3 fw-semibold">
                  {order.user?.name ||
                    order.shippingAddress?.name ||
                    "Customer"}
                </div>
                <div className="text-muted small">
                  {order.items?.length || 0} Items
                </div>
                <div className="fs-5 fw-bold mt-2">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="small mt-2">
                  Payment:{" "}
                  {order.paymentStatus || order.paymentMethod || "Pending"}
                </div>
                <div className="small text-muted">
                  Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </div>
                <div className="mt-3">{renderOrderActions(order)}</div>
              </div>
            ))}
          </div>
          {orders.length === 0 && (
            <div className="text-center text-muted py-5">
              No orders match these filters.
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="small text-muted">
              Page {page} of {totalPages}
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm rounded-pill"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-sm rounded-pill"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {selectedOrder && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(17,17,17,.45)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    Order {formatOrderId(selectedOrder._id)}
                  </h5>
                  <div className="small text-muted">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  aria-label="Close order details"
                  title="Close"
                  style={{
                    width: "38px",
                    height: "38px",
                    color: "#111111",
                    backgroundColor: "#F8FAF9",
                    border: "1px solid #54C69D",
                    opacity: 1,
                  }}
                  onClick={() => setSelectedOrder(null)}
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p className="mb-1">
                      {selectedOrder.user?.name ||
                        selectedOrder.shippingAddress?.name}
                    </p>
                    <p className="small text-muted mb-1">
                      {selectedOrder.user?.email}
                    </p>
                    <p className="small text-muted">
                      {selectedOrder.user?.phone ||
                        selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Delivery Address</h6>
                    <p className="small mb-0">
                      {selectedOrder.shippingAddress?.street}
                    </p>
                    <p className="small mb-0">
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state}
                    </p>
                    <p className="small">
                      {selectedOrder.shippingAddress?.zipCode}
                    </p>
                  </div>
                </div>
                <hr />
                <h6>Order Items</h6>
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    className="d-flex justify-content-between border-bottom py-2"
                    key={`${item.product?._id || "item"}-${index}`}
                  >
                    <span>
                      {item.product?.name || "Product"}{" "}
                      <small className="text-muted">× {item.quantity}</small>
                    </span>
                    <strong>
                      {formatCurrency(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
                <div className="d-flex justify-content-between fw-bold mt-3">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <hr />
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6>Payment</h6>
                    <p className="small mb-0">
                      Method: {selectedOrder.paymentMethod || "COD"}
                    </p>
                    <p className="small">
                      Status: {selectedOrder.paymentStatus || "Pending"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Update Status</h6>
                    <select
                      className="form-select"
                      value={selectedOrder.status}
                      disabled={saving}
                      onChange={(event) =>
                        updateStatus(selectedOrder._id, event.target.value)
                      }
                    >
                      {orderStatuses.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {visibleTimeline.map((item, index) => (
                    <span
                      className="small"
                      key={item}
                      style={{
                        color:
                          visibleTimeline.indexOf(selectedOrder.status) >= index
                            ? "#111111"
                            : "#999999",
                      }}
                    >
                      <span
                        style={{
                          color:
                            visibleTimeline.indexOf(selectedOrder.status) >=
                            index
                              ? "#54C69D"
                              : "#BDBDBD",
                        }}
                      >
                        ●
                      </span>{" "}
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn rounded-pill"
                  style={{ border: "1px solid #D9534F", color: "#D9534F" }}
                  disabled={
                    saving ||
                    ["Delivered", "Cancelled", "Refunded"].includes(
                      selectedOrder.status,
                    )
                  }
                  onClick={() => cancelOrder(selectedOrder._id)}
                >
                  Cancel Order
                </button>
                <button
                  className="btn rounded-pill"
                  style={{ backgroundColor: "#54C69D" }}
                  onClick={() => printInvoice(selectedOrder)}
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOrdersPage;
