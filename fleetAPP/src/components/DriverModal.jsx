import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleDriverRegistration,
  handleDriverUpdate,
} from "../controller/DriverController";
import { toast } from "react-toastify";

const DriverModal = ({ show, onClose, driverData, refreshDrivers }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    cnh: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Resetar ou carregar dados quando o modal é aberto
  useEffect(() => {
    if (show) {
      setErrors({});
      if (driverData) {
        setFormData({
          id: driverData.id || null,
          name: driverData.name || "",
          cnh: driverData.cnh || "",
          phone: driverData.phone || "",
        });
      } else {
        setFormData({
          id: null,
          name: "",
          cnh: "",
          phone: "",
        });
      }
    }
  }, [show, driverData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpa erro ao digitar
  };

  const detectFieldFromError = (message) => {
    if (message.toLowerCase().includes("nome")) return "name";
    if (message.toLowerCase().includes("cnh")) return "cnh";
    if (message.toLowerCase().includes("telefone")) return "phone";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (formData.id) {
        // Atualizar motorista
        const updated = await handleDriverUpdate(formData);
        if (updated) {
          toast.success("Motorista atualizado com sucesso!");
          refreshDrivers();
          onClose();
        }
      } else {
        // Criar novo motorista
        const created = await handleDriverRegistration(formData);
        if (created) {
          toast.success("Motorista cadastrado com sucesso!");
          refreshDrivers();
          onClose();
        }
      }
    } catch (error) {
      console.error("Erro no envio:", error.message);
      const field = detectFieldFromError(error.message);
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
        toast.error(error.message);
      } else {
        toast.error("Erro ao salvar motorista. Verifique os dados.");
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Fechar"></button>
        <h5 className="mb-4">{formData.id ? "Editar Motorista" : "Cadastrar Motorista"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="cnh" className="form-label">
              CNH
            </label>
            <input
              type="text"
              id="cnh"
              name="cnh"
              value={formData.cnh}
              onChange={handleChange}
              className={`form-control ${errors.cnh ? 'is-invalid' : ''}`}
              required
              maxLength="11"
            />
            {errors.cnh && <div className="invalid-feedback">{errors.cnh}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Telefone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {formData.id ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverModal;
