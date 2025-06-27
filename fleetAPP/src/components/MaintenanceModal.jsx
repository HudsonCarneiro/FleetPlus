import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleMaintenanceRegistration,
  handleMaintenanceUpdate,
  handleFetchMaintenanceById,
} from "../controller/MaintenanceController";
import { fetchVehicles, fetchServiceProviders } from "../services/MaintenanceServices";

const initialFormState = {
  vehicleId: "",
  serviceProviderId: "",
  date: "",
  type: "",
  description: "",
  nfe: "",
  price: "",
  status: "aberto",
};

const MaintenanceModal = ({ show, onClose, maintenanceData, refreshMaintenances, isEditMode }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        const [fetchedVehicles, fetchedProviders] = await Promise.all([
          fetchVehicles(),
          fetchServiceProviders(),
        ]);

        setVehicles(Array.isArray(fetchedVehicles) ? fetchedVehicles : []);
        setProviders(Array.isArray(fetchedProviders) ? fetchedProviders : []);
      } catch (error) {
        console.error("Erro ao carregar veículos ou fornecedores:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (show) fetchDropdownData();
  }, [show]);

  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode && maintenanceData?.id) {
        try {
          setLoading(true);
          const fetched = await handleFetchMaintenanceById(maintenanceData.id);
          setFormData({
            vehicleId: fetched.vehicleId || "",
            serviceProviderId: fetched.serviceProviderId || "",
            date: fetched.date || "",
            type: fetched.type || "",
            description: fetched.description || "",
            nfe: fetched.nfe || "",
            price: fetched.price || "",
            status: fetched.status || "aberto",
          });
        } catch (error) {
          console.error("Erro ao carregar manutenção para edição:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData(initialFormState);
      }
    };

    if (show) initializeForm();
  }, [show, isEditMode, maintenanceData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateFields = () => {
    const requiredFields = ["vehicleId", "serviceProviderId", "date", "type", "price"];
    const missing = requiredFields.filter((field) => !formData[field]);

    if (missing.length > 0) {
      console.error(`Preencha os campos obrigatórios: ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      if (isEditMode) {
        await handleMaintenanceUpdate(maintenanceData.id, formData);
        console.log("Manutenção atualizada com sucesso!");
      } else {
        await handleMaintenanceRegistration(formData);
        console.log("Manutenção registrada com sucesso!");
      }

      onClose();
      refreshMaintenances?.();
    } catch (error) {
      console.error("Erro ao salvar manutenção:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="btn-close" onClick={onClose}></button>
          <h3 className="text-center">
            {isEditMode ? "Editar Manutenção" : "Nova Manutenção"}
          </h3>

          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="vehicleId">Veículo</label>
                  <select id="vehicleId" className="form-control" value={formData.vehicleId} onChange={handleInputChange}>
                    <option value="">Selecione</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="serviceProviderId">Fornecedor</label>
                  <select id="serviceProviderId" className="form-control" value={formData.serviceProviderId} onChange={handleInputChange}>
                    <option value="">Selecione</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>{p.businessName}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="date">Data</label>
                  <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="type">Tipo</label>
                  <select id="type" className="form-control" value={formData.type} onChange={handleInputChange}>
                    <option value="">Selecione</option>
                    <option value="conserto">Conserto</option>
                    <option value="lavagem">Lavagem</option>
                    <option value="troca de oleo">Troca de óleo</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="col-md-12 mb-3">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="nfe">Nota Fiscal</label>
                  <input
                    type="text"
                    id="nfe"
                    className="form-control"
                    value={formData.nfe}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="price">Preço</label>
                  <input
                    type="number"
                    id="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ex: 150.00"
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="status">Status</label>
                  <select id="status" className="form-control" value={formData.status} onChange={handleInputChange}>
                    <option value="aberto">Aberto</option>
                    <option value="parcelado">Parcelado</option>
                    <option value="pago">Pago</option>
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

export default MaintenanceModal;
