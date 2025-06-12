import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleRegisterFueling,
  handleUpdateFueling,
  handleFetchDrivers,
  handleFetchVehicles,
} from "../controller/FuelingController";
import { toast } from "react-toastify";

const initialFormState = {
  driverId: "",
  vehicleId: "",
  liters: "",
  price: "",
  mileage: "",
  dateFueling: "",
};

const requiredFields = [
  "driverId",
  "vehicleId",
  "liters",
  "price",
  "mileage",
  "dateFueling",
];

const FuelingModal = ({ show, onClose, fuelingData, refreshFuelings, isEditMode }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega motoristas e veículos ao abrir o modal
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const fetchedDrivers = await handleFetchDrivers();
        const fetchedVehicles = await handleFetchVehicles();
        setDrivers(fetchedDrivers);
        setVehicles(fetchedVehicles);
      } catch (error) {
        console.log("Erro ao carregar motoristas e veículos.");
      }
    };

    if (show) {
      setFormData(isEditMode ? fuelingData : initialFormState);
      loadOptions();
    }
  }, [show, isEditMode, fuelingData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateFields = () => {
    const invalidFields = requiredFields.filter((field) => !formData[field]);
    if (invalidFields.length > 0) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      if (isEditMode) {
        await handleUpdateFueling(fuelingData.id, formData);
      } else {
        await handleRegisterFueling(formData);
      }
      onClose();
      refreshFuelings?.();
    } catch (error) {
      console.error("Erro ao salvar abastecimento:", error.message);
      toast.error("Erro ao salvar abastecimento. Verifique os dados informados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="btn-close" onClick={onClose}>
          </button>
          <h3 className="text-center">
            {isEditMode ? "Editar Abastecimento" : "Cadastrar Abastecimento"}
          </h3>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="driverId">
                    Motorista
                  </label>
                  <select
                    className="form-control"
                    id="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um motorista</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="vehicleId">
                    Veículo
                  </label>
                  <select
                    className="form-control"
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} ({vehicle.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="liters">
                    Litros
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="liters"
                    value={formData.liters}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="price">
                    Preço
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="mileage">
                    Quilometragem
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="dateFueling">
                    Data do Abastecimento
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    id="dateFueling"
                    value={formData.dateFueling}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          )}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : isEditMode ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FuelingModal;
