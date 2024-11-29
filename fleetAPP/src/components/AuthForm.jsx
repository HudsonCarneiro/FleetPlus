import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { handleLogin } from "../controller/AuthController"; 
import "../styles/Form.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Limpa mensagens anteriores
    try {
      const success = await handleLogin(formData, navigate);
      if (success) {
        console.log("Login realizado com sucesso!");
      } else {
        setMessage("Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setMessage("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container form-container mt-5 pt-5">
      {message && <p className="alert alert-warning">{message}</p>}
      <div className="card p-4">
        <div className="card-body">
          <h3 className="text-center">Entrar</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                placeholder="******"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Enviar
            </button>
            <p className="mb-3">
              Não tem uma conta?{" "}
              <Link to="/register" style={{ color: "#0d6efd", fontSize: "12px" }}>
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
