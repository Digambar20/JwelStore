import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { loginUser, loginAdmin } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // User Signup
        const response = await apiClient.post("/auth/user/signup", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        await loginUser(response.data.token);

        toast.success("Signup successful");

        navigate("/", { replace: true });
      } else {
        // Single Login (User/Admin)
        const response = await apiClient.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.role === "admin") {
          await loginAdmin(response.data.token);

          toast.success("Admin login successful");

          navigate("/admin", { replace: true });
        } else {
          await loginUser(response.data.token);

          toast.success("Login successful");

          const redirectTo = location.state?.from || "/";

          navigate(redirectTo, { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-lg my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div
            className="card shadow-lg border-0"
            style={{ borderTop: "3px solid #54C69D" }}
          >
            <div className="card-body p-5">
              <h2 className="text-center mb-4" style={{ color: "#111111" }}>
                {isSignup ? "Create Account" : "Login"}
              </h2>

              <form onSubmit={handleSubmit}>
                {isSignup && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>

                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone</label>

                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="9876543210"
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{
                    backgroundColor: "#54C69D",
                    color: "#111111",
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : isSignup
                      ? "Create Account"
                      : "Login"}
                </button>
              </form>

              <p className="text-center mt-3">
                {isSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}

                <button
                  className="btn btn-link p-0"
                  style={{ color: "#54C69D" }}
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
