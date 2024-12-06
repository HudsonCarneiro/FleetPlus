import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import {
  handleVehicleRegistration,
  handleVehicleUpdate,
} from '../controller/VehicleController.js';

const VehicleModal = ({ show, onClose, vehicleData, refreshVehicles }) => {
  const [formData, setFormData] = useState({
    id: null,
    plate: '',
    model: '',
    automaker: '',
    year: '',
    fuelType: '',
    mileage: '',
  });

  // Atualiza o formulário ao abrir o modal com dados do veiculo (em caso de edição)
  useEffect(() => {
    if (vehicleData) {
      setFormData({
        id: vehicleData.id || null,
        plate: vehicleData.palte || '',
        model: vehicleData.model|| '',
        automaker: vehicleData.automaker || '',
        year: vehicleData.year || '',
        fuelType: vehicleData.fuelType || '',
        mileage: '',
      });
    }
  }, [vehicleData]);

  const handleChange = (e) => {
    const { plate, value } = e.target;
    setFormData({ ...formData, [plate]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      // Atualizar motorista
      const updated = await handleVehicleUpdate(formData);
      if (updated) {
        alert('Motorista atualizado com sucesso!');
        refreshDrivers();
        onClose();
      } else {
        alert('Erro ao atualizar motorista.');
      }
    } else {
      // Criar novo motorista
      const created = await handleDriverRegistration(formData);
      if (created) {
        alert('Motorista cadastrado com sucesso!');
        refreshDrivers();
        onClose();
      } else {
        alert('Erro ao cadastrar motorista.');
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Fechar"></button>
        <h5 className="mb-4">{formData.id ? 'Editar Motorista' : 'Cadastrar Motorista'}</h5>
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
            {formData.id ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverModal;
