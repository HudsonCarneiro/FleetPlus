import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  handleUserUpdate,
  handleUserDeletion,
  handleFetchUserById,
} from '../controller/UserController';
import { toast } from "react-toastify";

const UserModal = ({ onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '', name: '', cpf: '', phone: '', cep: '', number: '',
    road: '', complement: '', city: '', state: '',
    email: '', password: '', addressId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const { id, addressId } = JSON.parse(storedUserData);
      setFormData((prev) => ({ ...prev, id, addressId }));

      const fetchUserData = async () => {
        const user = await handleFetchUserById(id);
        if (user) {
          setFormData((prev) => ({ ...prev, ...user }));
        }
      };

      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' })); // limpa erro ao digitar
  };

  // Melhorado para detectar "nome"
  const detectFieldFromError = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("nome")) return "name";
    if (msg.includes("cpf")) return "cpf";
    if (msg.includes("telefone") || msg.includes("phone")) return "phone";
    if (msg.includes("email")) return "email";
    if (msg.includes("senha") || msg.includes("password")) return "password";
    return null;
  };

  const handleUpdate = async () => {
    try {
      setErrors({});
      const success = await handleUserUpdate(formData);
      if (success) {
        toast.success("Usuário atualizado com sucesso!");
        onClose();
        onUpdate?.(formData);
      } else {
        toast.error("Erro ao atualizar usuário. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro no modal:", error);
      const field = detectFieldFromError(error.message);
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido ao atualizar usuário.");
      }
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Deseja excluir este usuário?");
    if (confirm) {
      const deleted = await handleUserDeletion(formData.id, formData.addressId, navigate);
      toast.info("Usuário exluido com sucesso!")
      if (deleted) onClose();
    }
  };

  if (!formData.id) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}></button>
        <h3 className="text-center">Editar Usuário</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            {Object.entries(formData)
              .filter(([key]) => key !== "id" && key !== "addressId")
              .map(([key, value]) => (
                <div className="col-md-6 mb-3" key={key}>
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
                    className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                   // readOnly={["cpf", "email"].includes(key)}
                  />
                  {errors[key] && (
                    <div className="invalid-feedback">{errors[key]}</div>
                  )}
                </div>
              ))}
          </div>
        </form>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
          <button className="btn btn-primary" onClick={handleUpdate}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
