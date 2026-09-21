import React, { createContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user/admin is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const userToken = localStorage.getItem("userToken");
      const adminToken = localStorage.getItem("adminToken");

      if (userToken) {
        try {
          const response = await apiClient.get("/auth/user/me");
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem("userToken");
        }
      }

      if (adminToken) {
        try {
          const response = await apiClient.get("/auth/admin/me");
          setAdmin(response.data.admin);
        } catch (error) {
          localStorage.removeItem("adminToken");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (token) => {
    try {
      localStorage.setItem("userToken", token);

      const response = await apiClient.get("/auth/user/me");

      setUser(response.data.user);

      return true;
    } catch (error) {
      localStorage.removeItem("userToken");
      console.error(error);
      return false;
    }
  };

  const loginAdmin = async (token) => {
    try {
      localStorage.setItem("adminToken", token);

      const response = await apiClient.get("/auth/admin/me");

      setAdmin(response.data.admin);

      return true;
    } catch (error) {
      localStorage.removeItem("adminToken");
      console.error(error);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");

    setUser(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get("/auth/user/me");
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        loginUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
