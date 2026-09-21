import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first to proceed to checkout");

      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container-lg my-4">
      <h2 style={{ color: "#1a1a1a", marginBottom: "30px" }}>
        🛒 Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p className="fs-5">Your cart is empty</p>
          <a
            href="/"
            className="btn"
            style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {/* Cart Items */}
            <div>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="card mb-3 shadow-sm"
                  style={{ borderLeft: "4px solid #d4af37" }}
                >
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={item.image || "https://via.placeholder.com/200"}
                        alt={item.name}
                        className="img-fluid"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title">{item.name}</h5>
                            <p className="text-muted">{item.category}</p>
                            <p className="fw-bold" style={{ color: "#d4af37" }}>
                              ₹{item.price}
                            </p>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </button>
                        </div>

                        {/* Quantity Control */}
                        <div className="d-flex align-items-center gap-2 mt-3">
                          <span>Qty:</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                          <span className="ms-auto text-muted">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4">
            <div
              className="card shadow-sm sticky-top"
              style={{ top: "100px", borderTop: "2px solid #d4af37" }}
            >
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Items:</span>
                  <span>{cart.length}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
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

                {!user && (
                  <div className="alert alert-warning small mt-3 mb-0">
                    <strong>🔐 Note:</strong> You need to login to proceed to
                    checkout.
                  </div>
                )}

                <button
                  className="btn w-100 mt-3 text-white fw-bold"
                  style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                  onClick={handleCheckout}
                >
                  {user ? "Proceed to Checkout" : "Login to Checkout"}
                </button>

                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>

                <a
                  href="/"
                  className="btn btn-link w-100 text-decoration-none mt-2"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
