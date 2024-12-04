import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import { handleUserUpdate, handleUserDeletion } from "../controller/UserController";
import { handleFetchAddressById } from "../controller/AddressController";

const UserModal = ({ userData, onClose, onUpdateSuccess, onDeleteSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    cpf: userData.cpf || "",
    phone: userData.phone || "",
    email: userData.email || "",
    password: "",
    cep: "",
    number: "",
    road: "",
    complement: "",
    city: "",
    state: "",
  });

  const [loadingAddress, setLoadingAddress] = useState(false);

  // Busca os dados do endereço ao montar o componente
  useEffect(() => {
    const fetchAddress = async () => {
      if (userData.addressId) {
        setLoadingAddress(true);
        try {
          const address = await handleFetchAddressById(userData.addressId);
          if (address) {
            setFormData((prev) => ({
              ...prev,
              cep: address.cep || "",
              number: address.number || "",
              road: address.road || "",
              complement: address.complement || "",
              city: address.city || "",
              state: address.state || "",
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
          alert("Erro ao carregar o endereço do usuário.");
        } finally {
          setLoadingAddress(false);
        }
      }
    };

    fetchAddress();
  }, [userData.addressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await handleUserUpdate(userData.id, formData);
      if (updatedUser) {
        console.log("Usuário atualizado com sucesso!");
        onUpdateSuccess?.(); // Callback para atualizar a lista de usuários
        onClose();
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      alert("Erro ao salvar as alterações. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    if (!userData.addressId) {
      alert("Endereço do usuário não encontrado. Não é possível deletar.");
      return;
    }

    if (window.confirm("Tem certeza de que deseja excluir este usuário?")) {
      try {
        const isDeleted = await handleUserDeletion(userData.id, userData.addressId);
        if (isDeleted) {
          console.log("Usuário excluído com sucesso!");
          onDeleteSuccess?.();
          onClose();
        } else {
          alert("Erro ao excluir o usuário. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao excluir o usuário:", error);
        alert("Erro ao excluir o usuário. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Usuário</h3>
        {loadingAddress ? (
          <p>Carregando endereço...</p>
        ) : (
          <form>
            {/* Dados Pessoais */}
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
            <label className="form-label">CPF</label>
            <input
              type="text"
              name="cpf"
              className="form-control"
              value={formData.cpf}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
            <div className="mb-3">
              <label className="form-label">CEP</label>
              <input
                type="text"
                name="cep"
                className="form-control"
                value={formData.cep}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Número</label>
              <input
                type="text"
                name="number"
                className="form-control"
                value={formData.number}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rua</label>
              <input
                type="text"
                name="road"
                className="form-control"
                value={formData.road}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Complemento</label>
              <input
                type="text"
                name="complement"
                className="form-control"
                value={formData.complement}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Estado</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            {/* Botões */}
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Deletar Usuário
              </button>
              <button type="button" className="btn btn-success" onClick={handleSave}>
                Salvar
              </button>
            </div>
          </form>
        )}
        {/* Botão para Fechar o Modal */}
        <button className="btn-close" onClick={onClose}>
          x
        </button>
      </div>
    </div>
  );
};

export default UserModal;
