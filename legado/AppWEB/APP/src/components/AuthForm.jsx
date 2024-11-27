import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../controller/AuthController'; // Importando o controller
import "../styles/Form.css";

const AuthForm = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Atualiza o estado com os dados inseridos pelo usuário
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Processa o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleLogin(formData, navigate); // Chama o handleLogin do controller
      if (success) {
        console.log('Login realizado com sucesso!');
      } else {
        alert('Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Tente novamente.');
    }
  };

  return (
    <div className="container form-container mt-5 pt-5">
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
            <button type="submit" className="btn btn-primary w-100">Enviar</button>
            <p className="mb-3">
              Não tem uma conta?{' '}
              <Link to="/register" style={{ color: '#0d6efd', fontSize: '12px' }}>
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
