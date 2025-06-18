import React, { createContext, useState, useEffect, useContext } from "react";
import { handleLogin, handleLogout } from "../controller/AuthController";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // <- Adicionado

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const stillValid = token && expiresAt && Date.now() < parseInt(expiresAt, 10);
    
    setIsAuthenticated(stillValid);
    setLoading(false); // <- Garante que o loading seja falso após a verificação
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  const login = async (formData, navigate) => {
  const result = await handleLogin(formData, navigate);
  if (result.success) {
    setIsAuthenticated(true);
    setLoading(false);
  }
  return result;
  };


  const logout = (navigate) => {
    handleLogout(navigate);
    setIsAuthenticated(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir o contexto
export const useAuth = () => useContext(AuthContext);
