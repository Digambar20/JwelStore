import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import ProductCard from "../components/landingPage/ProductCard";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminSalesPage from "./AdminSalesPage";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/notifications";

const AdminPage = () => {
  const { admin, logoutAdmin } = useContext(AuthContext);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    rating: "5",
    reviews: "0",
    category: "Bracelets",
    image: "",
    stock: "",
    material: "Gold",
    weight: "",
  });

  useEffect(() => {
    const requestedTab = new URLSearchParams(location.search).get("tab");
    if (["products", "orders", "sales"].includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  useEffect(() => {
    if (!admin) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, [admin, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "products") {
        let response = await apiClient.get("/products");
        const loadedProducts = response.data.products || [];
        setProducts(loadedProducts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : undefined,
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct._id}`, productPayload);
        toast.success("Product updated successfully");
      } else {
        await apiClient.post("/products", productPayload);
        toast.success("Product added successfully");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        rating: "5",
        reviews: "0",
        category: "Bracelets",
        image: "",
        stock: "",
        material: "Gold",
        weight: "",
      });
      setEditingProduct(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      rating: product.rating ?? "5",
      reviews: product.reviews ?? "0",
      category: product.category || "Bracelets",
      image: product.image || "",
      stock: product.stock ?? "",
      material: product.material || "Gold",
      weight: product.weight || "",
    });
    setShowForm(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please select an image smaller than 2 MB");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((currentData) => ({
        ...currentData,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProduct = async (id) => {
    if (await confirmToast("Delete this product?")) {
      try {
        await apiClient.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchData();
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  return (
    <div className="container-lg my-4">
      {/* Admin Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #111111 0%, #234d3f 100%)",
          color: "#54C69D",
          padding: "30px 20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-2">JwelStore Admin</h2>
            <p className="mb-0">
              Welcome, {admin?.name || admin?.email || "Admin"}
            </p>
          </div>
          <button
            className="btn"
            style={{ backgroundColor: "#54C69D", color: "#111111" }}
            onClick={() => {
              logoutAdmin();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="d-flex flex-row align-items-center gap-2 overflow-x-auto mb-4 pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          className={`btn flex-shrink-0 ${activeTab === "products" ? "text-white" : "btn-outline-secondary"}`}
          style={{
            backgroundColor: activeTab === "products" ? "#54C69D" : "#FFFFFF",
            color: "#111111",
            border:
              activeTab === "products"
                ? "1px solid #54C69D"
                : "1px solid rgba(84, 198, 157, 0.5)",
            boxShadow:
              activeTab === "products"
                ? "0 4px 12px rgba(84, 198, 157, 0.25)"
                : "none",
          }}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`btn flex-shrink-0 ${activeTab === "orders" ? "text-white" : "btn-outline-secondary"}`}
          style={{
            backgroundColor: activeTab === "orders" ? "#54C69D" : "#FFFFFF",
            color: "#111111",
            border:
              activeTab === "orders"
                ? "1px solid #54C69D"
                : "1px solid rgba(84, 198, 157, 0.5)",
            boxShadow:
              activeTab === "orders"
                ? "0 4px 12px rgba(84, 198, 157, 0.25)"
                : "none",
          }}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className="btn flex-shrink-0"
          style={{
            backgroundColor: activeTab === "sales" ? "#54C69D" : "#FFFFFF",
            color: "#111111",
            border:
              activeTab === "sales"
                ? "1px solid #54C69D"
                : "1px solid rgba(84, 198, 157, 0.5)",
            boxShadow:
              activeTab === "sales"
                ? "0 4px 12px rgba(84, 198, 157, 0.25)"
                : "none",
          }}
          onClick={() => {
            setActiveTab("sales");
            setShowForm(false);
          }}
        >
          Sales & Analytics
        </button>
        <button
          className="btn flex-shrink-0"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111111",
            border: "1px solid rgba(84, 198, 157, 0.5)",
          }}
          onClick={() => {
            setActiveTab("products");
            setEditingProduct(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          {showForm && (
            <div className="card shadow-sm mb-4 p-4">
              <h5 className="mb-3">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h5>
              <form onSubmit={handleAddProduct}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Old Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                      placeholder="e.g., 799"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="form-control"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Review Count</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.reviews}
                      onChange={(e) =>
                        setFormData({ ...formData, reviews: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option>Jhumkas</option>
                      <option>Bracelets</option>
                      <option>Bangles</option>
                      <option>Pendants</option>
                      <option>Rings</option>
                      <option>Earrings</option>
                      <option>Necklaces</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Material</label>
                    <select
                      className="form-control"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                    >
                      <option>Gold</option>
                      <option>Silver</option>
                      <option>Platinum</option>
                      <option>Copper</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Weight (g)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="e.g., 5g"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="mt-2 rounded"
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor: "#54C69D", color: "#111111" }}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </form>
            </div>
          )}

          <div className="row g-3 g-md-4">
            {products.map((product) => (
              <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                <ProductCard
                  product={product}
                  adminActions
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && <AdminOrdersPage />}
      {activeTab === "sales" && <AdminSalesPage />}
    </div>
  );
};

export default AdminPage;
