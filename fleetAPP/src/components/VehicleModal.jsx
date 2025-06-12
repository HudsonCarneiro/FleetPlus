import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleVehicleRegistration,
  handleVehicleUpdate,
} from "../controller/VehicleController.js";

const VehicleModal = ({ show, onClose, vehicleData, refreshVehicles }) => {
  const [formData, setFormData] = useState({
    id: null,
    plate: "",
    model: "",
    automaker: "",
    year: "",
    fuelType: "",
    mileage: "",
  });

  // Resetar ou carregar dados quando o modal é aberto
  useEffect(() => {
    if (show) {
      if (vehicleData) {
        // Carregar os dados do veículo para edição
        setFormData({
          id: vehicleData.id || null,
          plate: vehicleData.plate || "",
          model: vehicleData.model || "",
          automaker: vehicleData.automaker || "",
          year: vehicleData.year || "",
          fuelType: vehicleData.fuelType || "",
          mileage: vehicleData.mileage || "",
        });
      } else {
        // Resetar o formulário para cadastro de novo veículo
        setFormData({
          id: null,
          plate: "",
          model: "",
          automaker: "",
          year: "",
          fuelType: "",
          mileage: "",
        });
      }
    }
  }, [show, vehicleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentYear = new Date().getFullYear();
    if (formData.year < 1900 || formData.year > currentYear) {
      alert("Por favor, insira um ano de fabricação válido.");
      return;
    }

    if (formData.id) {
      const updated = await handleVehicleUpdate(formData);
      if (updated) {
        alert("Veículo atualizado com sucesso!");
        refreshVehicles();
        onClose();
      } else {
        alert("Erro ao atualizar veículo.");
      }
    } else {
      const created = await handleVehicleRegistration(formData);
      if (created) {
        alert("Veículo cadastrado com sucesso!");
        refreshVehicles();
        onClose();
      } else {
        alert("Erro ao cadastrar veículo.");
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Fechar"></button>
        <h5 className="mb-4">
          {formData.id ? "Editar Veículo" : "Cadastrar Veículo"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="plate" className="form-label">
              Placa
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              className="form-control"
              placeholder="AAA0A00"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="model" className="form-label">
              Modelo
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="automaker" className="form-label">
              Montadora
            </label>
            <input
              type="text"
              id="automaker"
              name="automaker"
              value={formData.automaker}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="year" className="form-label">
              Ano de Fabricação
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fuelType" className="form-label">
              Tipo de Combustível
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecione o tipo de combustível</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Etanol">Etanol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="mileage" className="form-label">
              Quilometragem
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
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

export default VehicleModal;
