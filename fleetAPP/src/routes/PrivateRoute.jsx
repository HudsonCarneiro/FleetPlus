import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Verifica se o token e o ID do usuário existem
  if (!token || !userId) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Você precisa estar logado para acessar o dashboard." }}
      />
    );
  }

  return children; // Permite o acesso à página protegida
};

export default PrivateRoute;
