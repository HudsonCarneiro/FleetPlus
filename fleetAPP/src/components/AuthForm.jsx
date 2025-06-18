import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <- USE o contexto
import "../styles/Form.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // <- PEGA A FUNÇÃO login DO CONTEXTO

  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const blockTimerRef = useRef(null);

  const [message, setMessage] = useState({
    text: location.state?.message || "",
    type: "" // 'error', 'warning', 'success'
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    return () => clearInterval(blockTimerRef.current);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const startCountdown = (seconds) => {
    clearInterval(blockTimerRef.current);
    setBlockTimeLeft(seconds);

    const timer = setInterval(() => {
      setBlockTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    blockTimerRef.current = timer;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      if (blockTimeLeft > 0) {
        return; // ← Evita múltiplos submits enquanto bloqueado
      }

      const response = await login(formData, navigate);

     if (!response.success) {
      const isBlocked = response.isBlocked;
      setMessage({
        text: response.message,
        type: isBlocked ? "warning" : "error",
      });

      if (isBlocked && response.remainingTime) {
        const totalSeconds = response.remainingTime * 60;
        startCountdown(totalSeconds);
      } else {
        setIsSubmitting(false); // ← Corrige o estado de carregamento infinito
      }

      return; // ← Evita seguir adiante
    }

      } catch (error) {
        setMessage({
          text: "Erro inesperado. Tente novamente mais tarde.",
          type: "error",
        });
        setIsSubmitting(false);
      }
    };

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

            {blockTimeLeft > 0 && (
              <p className="text-center mt-3 text-warning" aria-live="polite">
                Tente novamente em: {Math.floor(blockTimeLeft / 60)}m {blockTimeLeft % 60}s
              </p>
            )}

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
