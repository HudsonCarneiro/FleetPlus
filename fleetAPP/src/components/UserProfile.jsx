import React, { useState, useEffect } from "react";
import UserModal from "./UserModal.jsx";
import "../styles/UserProfile.css";
import { handleFetchUserById } from "../controller/UserController.js";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserFromLocalStorage = async () => {
      // Recupera o userId do localStorage
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const { id } = JSON.parse(storedUserData);
        setUserId(id); // Salva o userId no estado

        // Busca os dados completos do usuário pelo ID
        const user = await handleFetchUserById(id);
        if (user) {
          setUserData(user);
        } else {
          console.error("Erro ao buscar os dados do usuário.");
        }
      } else {
        console.error("Usuário não autenticado ou dados não encontrados.");
      }
    };

    fetchUserFromLocalStorage();
  }, []);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  if (!userData) {
    return <div>Carregando...</div>;
  }

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
      {isModalOpen && (
      <UserModal
        userData={userData}
        onClose={() => setModalOpen(false)}
        onUpdate={(updatedData) => setUserData(updatedData)} // Nova prop
  />
)}

    </div>
  );
};

export default UserProfile;
