import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleServiceProviderRegistration,
  handleServiceProviderUpdate,
} from "../controller/ServiceProviderController";

const ServiceProviderModal = ({ show, onClose, providerData, refreshProviders }) => {
  const [formData, setFormData] = useState({
    id: null,
    businessName: "",
    companyName: "",
    cnpj: "",
    phone: "",
  });

  useEffect(() => {
    if (show) {
      if (providerData) {
        setFormData({
          id: providerData.id || null,
          businessName: providerData.businessName || "",
          companyName: providerData.companyName || "",
          cnpj: providerData.cnpj || "",
          phone: providerData.phone || "",
        });
      } else {
        setFormData({
          id: null,
          businessName: "",
          companyName: "",
          cnpj: "",
          phone: "",
        });
      }
    }
  }, [show, providerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      const updated = await handleServiceProviderUpdate(formData);
      if (updated) {
        alert("Prestador de serviço atualizado com sucesso!");
        refreshProviders();
        onClose();
      } else {
        alert("Erro ao atualizar prestador de serviço.");
      }
    } else {
      const created = await handleServiceProviderRegistration(formData);
      if (created) {
        alert("Prestador de serviço cadastrado com sucesso!");
        refreshProviders();
        onClose();
      } else {
        alert("Erro ao cadastrar prestador de serviço.");
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Fechar" />
        <h5 className="mb-4">
          {formData.id ? "Editar Prestador de Serviço" : "Cadastrar Prestador de Serviço"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="businessName" className="form-label">Nome Fantasia</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Razão Social</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cnpj" className="form-label">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className="form-control"
              required
              maxLength="18"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Telefone</label>
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

export default ServiceProviderModal;
