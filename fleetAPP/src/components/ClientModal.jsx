import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import {
  handleClientUpdate,
  handleClientDeletion,
  handleFetchClientById,
  handleClientRegistration, // Adicionei uma função para criar um cliente
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
    addressId: "",
  });

  useEffect(() => {
    if (isEditMode && clientData) {
      // Define os IDs iniciais no formulário para edição
      setFormData((prevData) => ({
        ...prevData,
        id: clientData.id,
        addressId: clientData.addressId,
      }));

      // Busca os dados completos do cliente pelo ID, apenas para edição
      const fetchClientData = async () => {
        const user = await handleFetchClientById(clientData.id);
        if (user) {
          setFormData((prevData) => ({
            ...prevData,
            ...user, // Atualiza o formulário com os dados do usuário
          }));
        } else {
          console.error("Erro ao buscar os dados do cliente.");
        }
      };

      fetchClientData();
    } else {
      // Limpar o formulário para criação
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
        addressId: "",
      });
    }
  }, [clientData, isEditMode]); // A dependência agora inclui `isEditMode`

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleUpdate = async () => {
    if (
      !formData.businessName ||
      !formData.cnpj ||
      !formData.email ||
      !formData.cep ||
      !formData.road ||
      !formData.city ||
      !formData.state
    ) {
      console.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const updatedClient = await handleClientUpdate(formData);

    if (updatedClient) {
      console.log("Cliente atualizado com sucesso");
      onClose();
      if (refreshClients) {
        refreshClients(); // Atualiza a lista de clientes após a edição
      }
    } else {
      console.error("Erro ao atualizar o cliente");
    }
  };

  const handleCreate = async () => {
    if (
      !formData.businessName ||
      !formData.cnpj ||
      !formData.email ||
      !formData.cep ||
      !formData.road ||
      !formData.city ||
      !formData.state
    ) {
      console.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const newClient = await handleClientRegistration(formData);

    if (newClient) {
      console.log("Cliente criado com sucesso");
      onClose();
      if (refreshClients) {
        refreshClients(); // Atualiza a lista de clientes após a criação
      }
    } else {
      console.error("Erro ao criar o cliente");
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );
    if (confirmDeletion) {
      const deleted = await handleClientDeletion(formData.id, formData.addressId);
      if (deleted) {
        console.log("Cliente excluído com sucesso");
        onClose();
        if (refreshClients) {
          refreshClients(); // Atualiza a lista de clientes após a exclusão
        }
      } else {
        console.error("Erro ao excluir o cliente");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-center">{isEditMode ? "Editar Cliente" : "Criar Cliente"}</h3>
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
          {isEditMode && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Excluir
            </button>
          )}
          <button className="btn btn-primary" onClick={isEditMode ? handleUpdate : handleCreate}>
            {isEditMode ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
