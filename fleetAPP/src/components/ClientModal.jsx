import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleClientUpdate,
  handleFetchClientById,
  handleClientRegistration,
} from "../controller/ClientController";
import { toast } from "react-toastify";

const initialFormState = {
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
          setFormData({
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
          });
        } catch (error) {
          console.error("Erro ao buscar cliente:", error);
          toast.error("Erro ao carregar cliente para edição.");
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
      toast.error(
        `Os seguintes campos são obrigatórios: ${invalidFields.join(", ")}`
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
        await handleClientUpdate(clientData.id, formData); // Usa o ID do clientData
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await handleClientRegistration(formData);
        toast.success("Cliente cadastrado com sucesso!");
      }

      onClose();
      refreshClients?.();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente. Verifique os dados informados.");
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
            {isEditMode ? "Editar Cliente" : "Cadastrar Cliente"}
          </h3>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                {Object.keys(initialFormState).map((key) => (
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
