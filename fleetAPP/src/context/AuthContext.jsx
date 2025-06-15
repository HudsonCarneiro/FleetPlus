import React, { createContext, useState, useEffect } from "react";
import { handleLogin, handleLogout } from "../controller/AuthController";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    if (token && expiresAt && Date.now() < parseInt(expiresAt, 10)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  const login = async (formData, navigate) => {
    const success = await handleLogin(formData, navigate);
    if (success) setIsAuthenticated(true);
    return success;
  };

  const logout = (navigate) => {
    handleLogout(navigate);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
