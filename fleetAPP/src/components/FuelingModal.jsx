import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleRegisterFueling,
  handleUpdateFueling,
  handleFetchDrivers,
  handleFetchVehicles,
  handleFetchFuelingById
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
  const [loadingData, setLoadingData] = useState(false);

  // Carregar motoristas e veículos ao abrir o modal
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [fetchedDrivers, fetchedVehicles] = await Promise.all([
          handleFetchDrivers(),
          handleFetchVehicles(),
        ]);
        setDrivers(fetchedDrivers);
        setVehicles(fetchedVehicles);
      } catch (error) {
        console.error("Erro ao carregar motoristas ou veículos:", error.message);
        toast.error("Erro ao carregar opções de motoristas e veículos.");
      }
    };

    const loadFuelingData = async () => {
      if (isEditMode && fuelingData?.id) {
        setLoadingData(true);
        try {
          const fetchedFueling = await handleFetchFuelingById(fuelingData.id);
          if (fetchedFueling) {
            // Ajusta datas para input type="date"
            setFormData({
              ...fetchedFueling,
              dateFueling: fetchedFueling.dateFueling
                ? new Date(fetchedFueling.dateFueling).toISOString().split("T")[0]
                : "",
            });
          } else {
            toast.error("Não foi possível carregar os dados do abastecimento.");
          }
        } catch (error) {
          console.error("Erro ao buscar abastecimento:", error.message);
          toast.error("Erro ao carregar dados do abastecimento.");
        } finally {
          setLoadingData(false);
        }
      } else {
        setFormData(initialFormState);
      }
    };

    if (show) {
      loadOptions();
      loadFuelingData();
    }
  }, [show, isEditMode, fuelingData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateFields = () => {
    const missing = requiredFields.filter((field) => !formData[field]);
    if (missing.length) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      if (isEditMode) {
        await handleUpdateFueling(fuelingData.id, formData);
        toast.success("Abastecimento atualizado com sucesso!");
      } else {
        await handleRegisterFueling(formData);
        toast.success("Abastecimento cadastrado com sucesso!");
      }
      onClose();
      refreshFuelings?.();
    } catch (error) {
      console.error("Erro ao salvar abastecimento:", error.message);
      toast.error("Erro ao salvar abastecimento. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="btn-close" onClick={onClose} aria-label="Fechar"></button>
          <h3 className="text-center">
            {isEditMode ? "Editar Abastecimento" : "Cadastrar Abastecimento"}
          </h3>

          {(loadingData || loading) ? (
            <p className="text-center my-3">Carregando dados...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="driverId" className="form-label">Motorista</label>
                  <select
                    className="form-control"
                    id="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um motorista</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="vehicleId" className="form-label">Veículo</label>
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
                  <label htmlFor="liters" className="form-label">Litros</label>
                  <input
                    type="number"
                    className="form-control"
                    id="liters"
                    value={formData.liters}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">Preço</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="mileage" className="form-label">Quilometragem</label>
                  <input
                    type="number"
                    className="form-control"
                    id="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="dateFueling" className="form-label">Data do Abastecimento</label>
                  <input
                    type="date"
                    className="form-control"
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
              disabled={loading || loadingData}
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
