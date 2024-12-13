import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleDeliveryOrderRegistration,
  handleDeliveryOrderUpdate,
  handleFetchDeliveryOrderById,
} from "../controller/DeliveryOrderController";
import {
  fetchClients,
  fetchVehicles,
  fetchDrivers,
} from "../services/DeliveryOrderServices";
import { toast } from "react-toastify";

const initialFormState = {
  clientId: "",
  driverId: "",
  vehicleId: "",
  deliveryDate: "",
  status: "aguardando",
  urgency: "verde",
};

const DeliveryModal = ({ show, onClose, deliveryData, refreshDeliveries, isEditMode }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]); // Inicializa como array vazio
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Busca dados de clientes, veículos e motoristas
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        const [fetchedClients, fetchedVehicles, fetchedDrivers] = await Promise.all([
          fetchClients(),
          fetchVehicles(),
          fetchDrivers(),
        ]);

        // Verifica se os dados retornados são arrays antes de atualizar o estado
        setClients(Array.isArray(fetchedClients) ? fetchedClients : []);
        setVehicles(Array.isArray(fetchedVehicles) ? fetchedVehicles : []);
        setDrivers(Array.isArray(fetchedDrivers) ? fetchedDrivers : []);
      } catch (error) {
        console.error("Erro ao carregar dados para o formulário:", error.message);
        toast.error("Erro ao carregar dados para o formulário.");
      } finally {
        setLoading(false);
      }
    };

    if (show) fetchDropdownData();
  }, [show]);

  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode && deliveryData?.id) {
        try {
          setLoading(true);
          const fetchedDelivery = await handleFetchDeliveryOrderById(deliveryData.id);
          setFormData({
            clientId: fetchedDelivery.clientId || "",
            driverId: fetchedDelivery.driverId || "",
            vehicleId: fetchedDelivery.vehicleId || "",
            deliveryDate: fetchedDelivery.deliveryDate
              ? new Date(fetchedDelivery.deliveryDate).toISOString().split("T")[0]
              : "",
            status: fetchedDelivery.status || "aguardando",
            urgency: fetchedDelivery.urgency || "verde",
          });
        } catch (error) {
          console.error("Erro ao buscar ordem de entrega:", error.message);
          toast.error("Erro ao carregar ordem de entrega para edição.");
        } finally {
          setLoading(false);
        }
      } else {
        setFormData(initialFormState);
      }
    };

    if (show) initializeForm();
  }, [show, isEditMode, deliveryData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateFields = () => {
    const requiredFields = ["clientId", "driverId", "vehicleId"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(
        `Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      if (isEditMode) {
        await handleDeliveryOrderUpdate(deliveryData.id, formData);
        toast.success("Ordem de entrega atualizada com sucesso!");
      } else {
        await handleDeliveryOrderRegistration(formData);
        toast.success("Ordem de entrega registrada com sucesso!");
      }

      onClose();
      refreshDeliveries?.();
    } catch (error) {
      console.error("Erro ao salvar ordem de entrega:", error.message);
      toast.error("Erro ao salvar ordem de entrega. Verifique os dados fornecidos.");
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
            {isEditMode ? "Editar Ordem de Entrega" : "Nova Ordem de Entrega"}
          </h3>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="clientId">
                    Cliente
                  </label>
                  <select
                    className="form-control"
                    id="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.businessName}
                      </option>
                    ))}
                  </select>
                </div>
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
                        {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="deliveryDate">
                    Data de Entrega
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    id="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    className="form-control"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="aguardando">Aguardando</option>
                    <option value="enviado">Enviado</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="urgency">
                    Urgência
                  </label>
                  <select
                    className="form-control"
                    id="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="verde">Verde</option>
                    <option value="amarela">Amarela</option>
                    <option value="vermelha">Vermelha</option>
                  </select>
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

export default DeliveryModal;
