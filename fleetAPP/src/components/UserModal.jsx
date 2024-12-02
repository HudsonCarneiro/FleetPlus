import React from "react";
import "../styles/Modal.css";

const UserModal = ({ userData, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Usuário</h3>
        <form>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" defaultValue={userData.name} />
          </div>
          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input type="text" className="form-control" defaultValue={userData.cpf} />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefone</label>
            <input type="text" className="form-control" defaultValue={userData.phone} />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" defaultValue={userData.email} />
          </div>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-danger">
              Deletar Usuário
            </button>
            <button type="button" className="btn btn-success">
              Salvar
            </button>
          </div>
        </form>
        <button className="btn-close" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default UserModal;
