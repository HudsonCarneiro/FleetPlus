import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleClientUpdate,
  handleFetchClientById,
  handleClientRegistration,
} from "../controller/ClientController";

const ClientModal = ({ show, onClose, clientData, refreshClients, isEditMode }) => {
  const [formData, setFormData] = useState({
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
    addressId: "", // Necessário para atualizar o endereço
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode && clientData?.id) {
        console.log("Dados recebidos do cliente:", clientData);

        try {
          // Carregar os dados do cliente e do endereço
          const fetchedClient = await handleFetchClientById(clientData.id);
          console.log("Dados do cliente carregados:", fetchedClient);

          if (fetchedClient) {
            setFormData({
              id: fetchedClient.id || "",
              businessName: fetchedClient.businessName || "",
              companyName: fetchedClient.companyName || "",
              cnpj: fetchedClient.cnpj || "",
              phone: fetchedClient.phone || "",
              email: fetchedClient.email || "",
              cep: fetchedClient.cep || "",
              number: fetchedClient.number || "",
              road: fetchedClient.road || "",
              complement: fetchedClient.complement || "",
              city: fetchedClient.city || "",
              state: fetchedClient.state || "",
              addressId: fetchedClient.addressId || "", // Setar o addressId
            });
          } else {
            console.error("Cliente não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do cliente:", error);
        }
      } else {
        setFormData({
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
          addressId: "", // Limpar o addressId ao criar um novo cliente
        });
      }
    };

    initializeForm();
  }, [isEditMode, clientData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSave = async () => {
    const requiredFields = [
      "businessName",
      "companyName",
      "cnpj",
      "phone",
      "email",
      "cep",
      "road",
      "city",
      "state",
    ];
    const isValid = requiredFields.every((field) => formData[field]);

    if (!isValid) {
      console.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (isEditMode) {
        // Passando formData com os dados do cliente e do endereço para o controller
        const updated = await handleClientUpdate(formData);
        if (updated) {
          console.log("Cliente e endereço atualizados com sucesso.");
        }
      } else {
        // Cadastrar cliente e endereço
        const { addressId } = await handleClientRegistration(formData); // Salva o addressId da resposta
        if (addressId) {
          // Atualizar formData com o addressId retornado
          setFormData((prevData) => ({
            ...prevData,
            addressId: addressId,
          }));
          console.log("Cliente e endereço cadastrados com sucesso.");
        }
      }

      onClose();
      refreshClients?.();
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? "atualizar" : "cadastrar"} o cliente:`,
        error
      );
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
          <form className="mt-4">
            <div className="row">
              {Object.keys(formData)
                .filter((key) => key !== "id" && key !== "addressId") // Filtra os campos não exibíveis
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
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-primary w-100" onClick={handleSave}>
              {isEditMode ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ClientModal;
