import React, { useState } from "react";
import "../styles/Modal.css";
import { handleUserUpdate, handleUserDeletion } from "../controller/UserController";

const UserModal = ({ userData, onClose, onUpdateSuccess, onDeleteSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    cpf: userData.cpf || "",
    phone: userData.phone || "",
    email: userData.email || "",
    password: "",
    cep: userData.cep || "",
    number: userData.number || "",
    road: userData.road || "",
    complement: userData.complement || "",
    district: userData.district || "",
    city: userData.city || "",
    state: userData.state || "",
  });

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
    // Valida se o endereço está presente
    console.log('endereco: ' ,userData.addressId)
    if (!userData.addressId) {
      alert("Endereço do usuário não encontrado. Não é possível deletar.");
      return;
    }
  
    // Confirma a ação do usuário
    if (window.confirm("Tem certeza de que deseja excluir este usuário?")) {
      try {
        // Chama o controller para deletar
        const isDeleted = await handleUserDeletion(userData.id, userData.addressId);
        if (isDeleted) {
          console.log("Usuário excluído com sucesso!");
          onDeleteSuccess?.(); // Atualiza a lista de usuários no componente pai
          onClose(); // Fecha o modal
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

          {/* Endereço */}
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
            <label className="form-label">Bairro</label>
            <input
              type="text"
              name="district"
              className="form-control"
              value={formData.district}
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

          {/* Senha */}
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Digite uma nova senha"
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

        {/* Botão para Fechar o Modal */}
        <button className="btn-close" onClick={onClose}>
          x
        </button>
      </div>
    </div>
  );
};

export default UserModal;
