import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleClientUpdate,
  handleFetchClientById,
  handleClientRegistration,
} from "../controller/ClientController";

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

const requiredFields = [
  "businessName",
  "companyName",
  "cnpj",
  "cep",
  "road",
  "city",
  "state",
];

const ClientModal = ({ show, onClose, clientData, refreshClients, isEditMode }) => {
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
    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await handleClientUpdate(formData);
        console.log("Cliente atualizado com sucesso.");
      } else {
        await handleClientRegistration(formData);
        console.log("Cliente cadastrado com sucesso.");
      }

      onClose();
      refreshClients?.();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
          <h3 className="text-center">
            {isEditMode ? "Editar Cliente" : "Cadastrar Cliente"}
          </h3>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                {Object.keys(initialFormState)
                  .filter((key) => key !== "id" && key !== "addressId")
                  .map((key) => (
                    <div className="col-md-6 mb-3" key={key}>
                      <label className="form-label" htmlFor={key}>
                        {(() => {
                          switch (key) {
                            case "businessName":
                              return "Nome Fantasia";
                            case "companyName":
                              return "Razão Social";
                            case "cnpj":
                              return "CNPJ";
                            case "phone":
                              return "Telefone";
                            case "email":
                              return "E-mail";
                            case "cep":
                              return "CEP";
                            case "number":
                              return "Número";
                            case "road":
                              return "Rua";
                            case "complement":
                              return "Complemento";
                            case "city":
                              return "Cidade";
                            case "state":
                              return "Estado";
                            default:
                              return key;
                          }
                        })()}
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

export default ClientModal;
