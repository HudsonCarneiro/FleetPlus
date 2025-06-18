import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { handleLogin } from "../controller/AuthController"; 
import "../styles/Form.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState({
    text: location.state?.message || "",
    type: "" // 'error', 'warning', 'success'
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    
    try {
      const { success, message: responseMessage, isBlocked } = await handleLogin(formData, navigate);
      
      if (!success) {
        setMessage({
          text: responseMessage,
          type: isBlocked ? 'warning' : 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: "Erro inesperado. Tente novamente mais tarde.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilo dinâmico para a mensagem
  const getAlertClass = () => {
    switch (message.type) {
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'success': return 'alert-success';
      default: return 'alert-info';
    }
  };

  return (
    <div className="container form-container mt-5 pt-5">
      {message.text && (
        <div className={`alert ${getAlertClass()} alert-dismissible fade show`}>
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ text: "", type: "" })}
          />
        </div>
      )}
      
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Carregando...
                </>
              ) : (
                "Enviar"
              )}
            </button>
            <p className="mb-3 mt-3 text-center">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary">
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