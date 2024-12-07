import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleDriverRegistration,
  handleDriverUpdate,
} from "../controller/DriverController";

const DriverModal = ({ show, onClose, driverData, refreshDrivers }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    cnh: "",
    phone: "",
  });

  // Resetar ou carregar dados quando o modal é aberto
  useEffect(() => {
    if (show) {
      if (driverData) {
        // Carregar os dados do motorista para edição
        setFormData({
          id: driverData.id || null,
          name: driverData.name || "",
          cnh: driverData.cnh || "",
          phone: driverData.phone || "",
        });
      } else {
        // Resetar o formulário para cadastro de novo motorista
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      // Atualizar motorista
      const updated = await handleDriverUpdate(formData);
      if (updated) {
        alert("Motorista atualizado com sucesso!");
        refreshDrivers();
        onClose();
      } else {
        alert("Erro ao atualizar motorista.");
      }
    } else {
      // Criar novo motorista
      const created = await handleDriverRegistration(formData);
      if (created) {
        alert("Motorista cadastrado com sucesso!");
        refreshDrivers();
        onClose();
      } else {
        alert("Erro ao cadastrar motorista.");
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
              className="form-control"
              required
            />
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
              className="form-control"
              required
              maxLength="11"
            />
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
              className="form-control"
              required
            />
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
