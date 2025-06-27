import React, { useState } from 'react';
import { handleUserRegistration } from '../controller/UserController';
import { fetchAddressByCep } from '../utils/CepUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', cpf: '', phone: '', cep: '', number: '',
    road: '', complement: '', city: '', state: '',
    email: '', password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleCepBlur = async () => {
    const cep = formData.cep;
    if (cep.length === 8) {
      try {
        const address = await fetchAddressByCep(cep);
        if (address) {
          setFormData((prev) => ({
            ...prev,
            road: address.logradouro || '',
            city: address.localidade || '',
            state: address.uf || '',
          }));
        }
      } catch {
        toast.error('Erro ao buscar endereço para o CEP.');
      }
    } else {
      setErrors((prev) => ({ ...prev, cep: 'Digite um CEP válido com 8 números.' }));
    }
  };

  // Melhor detecção de campo para erros de validação
  const detectFieldFromError = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("nome")) return "name";
    if (msg.includes("cpf")) return "cpf";
    if (msg.includes("telefone")) return "phone";
    if (msg.includes("email")) return "email";
    if (msg.includes("senha")) return "password";
    if (msg.includes("cep")) return "cep";
    if (msg.includes("rua")) return "road";
    if (msg.includes("cidade")) return "city";
    if (msg.includes("estado")) return "state";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      await handleUserRegistration(formData, navigate);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      if (error && error.message) {
        const field = detectFieldFromError(error.message);
        if (field) {
          setErrors((prev) => ({ ...prev, [field]: error.message }));
        } else {
          toast.error(error.message || "Erro ao registrar usuário. Verifique os dados.");
        }
      } else {
        toast.error("Erro inesperado ao registrar usuário.");
      }
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="card p-4">
        <h3 className="text-center">Cadastrar Usuário</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div className="mb-3" key={key}>
              <label htmlFor={key} className="form-label">
                {key === "name" ? "Nome" :
                 key === "cpf" ? "CPF" :
                 key === "phone" ? "Telefone" :
                 key === "cep" ? "CEP" :
                 key === "number" ? "Número" :
                 key === "road" ? "Rua" :
                 key === "complement" ? "Complemento" :
                 key === "city" ? "Cidade" :
                 key === "state" ? "Estado" :
                 key === "email" ? "E-mail" :
                 key === "password" ? "Senha" : key}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                id={key}
                value={value}
                onChange={handleInputChange}
                onBlur={key === "cep" ? handleCepBlur : null}
                className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                placeholder={`Digite ${key}`}
              />
              {errors[key] && (
                <div className="invalid-feedback">{errors[key]}</div>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-100">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
