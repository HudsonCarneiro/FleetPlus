import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Exemplo de verificação de token
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Permite o acesso à página protegida
};

export default PrivateRoute;
