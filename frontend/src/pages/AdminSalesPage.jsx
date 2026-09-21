import React, { useEffect, useMemo, useState } from "react";
import { FaDownload, FaRedo, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

const ranges = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "This Year",
];
const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const dateValue = (date) => date.toISOString().slice(0, 10);

const getRange = (range) => {
  const end = new Date();
  const start = new Date(end);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);
  if (range === "Yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (range === "Last 7 Days") start.setDate(start.getDate() - 6);
  else if (range === "Last 30 Days") start.setDate(start.getDate() - 29);
  else if (range === "This Month") start.setDate(1);
  else if (range === "Last Month") {
    start.setMonth(start.getMonth() - 1, 1);
    end.setDate(0);
  } else if (range === "This Year") {
    start.setMonth(0, 1);
  }
  return { startDate: dateValue(start), endDate: dateValue(end) };
};

const SalesMetric = ({ label, value, accent = "#54C69D" }) => (
  <div
    className="card border-0 shadow-sm h-100 p-3"
    style={{ borderTop: `3px solid ${accent}` }}
  >
    <div className="small text-uppercase fw-semibold text-muted">{label}</div>
    <div className="fs-4 fw-bold mt-2" style={{ color: "#111111" }}>
      {value}
    </div>
  </div>
);

const AdminSalesPage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState("Last 30 Days");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = getRange(range);
      const response = await apiClient.get(
        `/orders/admin/analytics?startDate=${params.startDate}&endDate=${params.endDate}`,
      );
      setAnalytics(response.data.analytics);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load sales analytics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const chartData = analytics?.dailyRevenue || [];
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);
  const statusData = useMemo(
    () =>
      Object.entries(analytics?.statusBreakdown || {}).sort(
        (a, b) => b[1] - a[1],
      ),
    [analytics],
  );
  const categoryMax = Math.max(
    ...(analytics?.categories || []).map((item) => item.revenue),
    1,
  );

  const exportReport = () => {
    const rows = [
      "Date,Revenue",
      ...chartData.map((item) => `${item.date},${item.revenue}`),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.join("\n")], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `jwelstore-sales-${range.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <p
            className="text-uppercase small fw-semibold mb-1"
            style={{ color: "#54C69D" }}
          >
            Performance
          </p>
          <h2 className="mb-1">Sales & Analytics</h2>
          <p className="mb-0 text-muted">
            Real sales performance from your MongoDB orders.
          </p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            {ranges.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            className="btn rounded-pill"
            style={{ border: "1px solid #54C69D" }}
            onClick={fetchAnalytics}
            title="Refresh"
          >
            <FaRedo />
          </button>
          <button
            className="btn rounded-pill"
            style={{ backgroundColor: "#54C69D" }}
            onClick={exportReport}
            disabled={!analytics}
          >
            <FaDownload />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          {error}
          <button className="btn btn-sm" onClick={fetchAnalytics}>
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#54C69D" }} />
        </div>
      ) : (
        analytics && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <SalesMetric
                  label="Total Sales"
                  value={money(analytics.totalRevenue)}
                />
              </div>
              <div className="col-6 col-lg-3">
                <SalesMetric
                  label="Total Orders"
                  value={analytics.totalOrders.toLocaleString("en-IN")}
                />
              </div>
              <div className="col-6 col-lg-3">
                <SalesMetric
                  label="Average Order Value"
                  value={money(analytics.averageOrderValue)}
                />
              </div>
              <div className="col-6 col-lg-3">
                <SalesMetric
                  label="Customers"
                  value={analytics.customers.toLocaleString("en-IN")}
                />
              </div>
            </div>

            {analytics.totalRevenue === 0 ? (
              <div className="card border-0 shadow-sm text-center text-muted py-5 mb-4">
                No sales data available for this period.
              </div>
            ) : (
              <div className="row g-4 mb-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <div className="d-flex justify-content-between">
                      <h5>Sales Overview</h5>
                      <span className="small text-muted">Revenue by day</span>
                    </div>
                    <div
                      className="d-flex align-items-end gap-2"
                      style={{ height: "240px", overflowX: "auto" }}
                    >
                      {chartData.map((item) => (
                        <div
                          className="d-flex flex-column align-items-center justify-content-end flex-shrink-0"
                          style={{ width: "34px", height: "100%" }}
                          key={item.date}
                        >
                          <div
                            title={money(item.revenue)}
                            style={{
                              height: `${Math.max((item.revenue / maxRevenue) * 190, 4)}px`,
                              width: "100%",
                              backgroundColor: "#54C69D",
                              borderRadius: "5px 5px 0 0",
                            }}
                          />
                          <small
                            className="text-muted mt-2"
                            style={{
                              fontSize: "9px",
                              transform: "rotate(-45deg)",
                            }}
                          >
                            {item.date.slice(5)}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <h5 className="mb-4">Revenue Breakdown</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Recognized Revenue</span>
                      <strong>{money(analytics.totalRevenue)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Paid / Completed</span>
                      <strong>{money(analytics.paidRevenue)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Pending Payments</span>
                      <strong>{money(analytics.pendingPayments)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Refunded</span>
                      <strong>{money(analytics.refundedAmount)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Cancelled Orders</span>
                      <strong>{analytics.cancelledOrders}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row g-4 mb-4">
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="mb-3">Order Status</h5>
                  {statusData.map(([name, count]) => (
                    <div className="mb-3" key={name}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{name}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="progress" style={{ height: "7px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(count / Math.max(analytics.totalOrders, 1)) * 100}%`,
                            backgroundColor: "#54C69D",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="mb-3">Category Sales</h5>
                  {analytics.categories.length === 0 ? (
                    <p className="text-muted">No category sales available.</p>
                  ) : (
                    analytics.categories.map((item) => (
                      <div className="mb-3" key={item.name}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>{item.name}</span>
                          <strong>{money(item.revenue)}</strong>
                        </div>
                        <div className="progress" style={{ height: "7px" }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(item.revenue / categoryMax) * 100}%`,
                              backgroundColor: "#54C69D",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm p-4">
                  <h5 className="mb-3">Top Selling Products</h5>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topProducts.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={
                                    item.image ||
                                    "https://via.placeholder.com/42"
                                  }
                                  alt=""
                                  style={{
                                    width: "42px",
                                    height: "42px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                  }}
                                />
                                <div>
                                  <div className="fw-semibold">{item.name}</div>
                                  <small className="text-muted">
                                    {item.category}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{item.units}</td>
                            <td className="fw-semibold">
                              {money(item.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Orders</h5>
                    <button
                      className="btn btn-sm rounded-pill"
                      style={{ border: "1px solid #54C69D" }}
                      onClick={() => navigate("/admin#orders")}
                    >
                      View All
                    </button>
                  </div>
                  {analytics.recentOrders.map((order) => (
                    <div
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      key={order._id}
                    >
                      <div>
                        <div className="fw-semibold">
                          #JWEL{order._id.slice(-5).toUpperCase()}
                        </div>
                        <small className="text-muted">
                          {order.user?.name ||
                            order.shippingAddress?.name ||
                            "Customer"}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="fw-semibold">
                          {money(order.totalAmount)}
                        </div>
                        <small className="text-muted">{order.status}</small>
                      </div>
                    </div>
                  ))}
                  {analytics.recentOrders.length === 0 && (
                    <p className="text-muted mb-0">No recent orders.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
};

export default AdminSalesPage;
