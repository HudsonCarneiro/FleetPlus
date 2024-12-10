import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleClientUpdate,
  handleFetchClientById,
  handleClientRegistration,
} from "../controller/ClientController";

const ClientModal = ({ show, onClose, clientData, refreshClients, isEditMode }) => {
  const initialFormState = {
    id: "",
    businessName: "",
    companyName: "",
    cnpj: "",
    phone: "",
    email: "",
    cep: "",
    number: "",
    road: "",
    complement: "",
    city: "",
    state: "",
    addressId: "",
  };

  const fieldLabels = {
    businessName: "Nome Fantasia",
    companyName: "Razão Social",
    cnpj: "CNPJ",
    phone: "Telefone",
    email: "E-mail",
    cep: "CEP",
    number: "Número",
    road: "Rua",
    complement: "Complemento",
    city: "Cidade",
    state: "Estado",
  };

  const requiredFields = ["businessName", "companyName", "cnpj", "cep", "road", "city", "state"];

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode && clientData?.id) {
        try {
          setLoading(true);
          const fetchedClient = await handleFetchClientById(clientData.id);
          if (fetchedClient) {
            setFormData({
              id: fetchedClient.id || "",
              businessName: fetchedClient.businessName || "",
              companyName: fetchedClient.companyName || "",
              cnpj: fetchedClient.cnpj || "",
              phone: fetchedClient.phone || "",
              email: fetchedClient.email || "",
              cep: fetchedClient.address?.cep || "",
              number: fetchedClient.address?.number || "",
              road: fetchedClient.address?.road || "",
              complement: fetchedClient.address?.complement || "",
              city: fetchedClient.address?.city || "",
              state: fetchedClient.address?.state || "",
              addressId: fetchedClient.address?.id || "",
            });
          } else {
            console.warn("Nenhum cliente encontrado para o ID fornecido.");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do cliente:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData(initialFormState);
      }
    };
  
    if (show) initializeForm();
  }, [show, isEditMode, clientData]);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateFields = () => {
    const invalidFields = requiredFields.filter((field) => !formData[field]);
    if (invalidFields.length > 0) {
      alert(
        `Os seguintes campos são obrigatórios e estão vazios: ${invalidFields.join(", ")}`
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
        const updated = await handleClientUpdate(formData);
        if (updated) console.log("Cliente atualizado com sucesso.");
      } else {
        const result = await handleClientRegistration(formData);
        if (result) console.log("Cliente cadastrado com sucesso.");
      }
      onClose();
      refreshClients?.();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const FormFields = () => (
    <form className="mt-4">
      <div className="row">
        {Object.keys(formData)
          .filter((key) => key !== "id" && key !== "addressId")
          .map((key) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label" htmlFor={key}>
                {fieldLabels[key] || key}
              </label>
              <input
                className="form-control"
                type="text"
                id={key}
                value={formData[key]}
                onChange={handleInputChange}
              />
            </div>
          ))}
      </div>
    </form>
  );

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Fechar Modal"
          >
            &times;
          </button>
          <h3 className="text-center">
            {isEditMode ? "Editar Cliente" : "Cadastrar Cliente"}
          </h3>
          {loading ? <p className="text-center">Carregando...</p> : <FormFields />}
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

export default ClientModal;
