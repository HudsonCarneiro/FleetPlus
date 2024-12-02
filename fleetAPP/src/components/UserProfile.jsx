import React, { useState } from "react";
import UserModal from "./UserModal.jsx";
import "../styles/UserProfile.css";

const UserProfile = ({ userData }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="container user-profile mt-5 pt-5">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="text-center">Perfil do Usuário</h3>
          <form className="mt-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.name}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.cpf}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.phone}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={userData.email}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">CEP</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.cep}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Rua</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.road}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.number}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.city}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Estado</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.state}
                  readOnly
                />
              </div>
            </div>
          </form>
          <button
            className="btn btn-primary float-end"
            onClick={handleEditClick}
          >
            Editar Usuário
          </button>
        </div>
      </div>
      {isModalOpen && <UserModal userData={userData} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default UserProfile;
