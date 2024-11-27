import React, { useState, useEffect } from 'react';
import { handleFetchUsers, handleDeleteUser } from "../controller/UserController";
import UserFormEdit from './UserFormEdit'; 
import UserForm from './UserFormModal'; 
import "../styles/Dashboard.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState(null);
  const [isRegisterModal, setIsRegisterModal] = useState(false); 

  // Função para abrir o modal
  const toggleModal = (userId = null, isRegister = false) => {
    setUserIdToEdit(userId);
    setIsRegisterModal(isRegister);
    setShowModal(!showModal);
  };

  const fetchData = async () => {
    const data = await handleFetchUsers();
    setUsers(data);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
      const response = await handleDeleteUser(userId);
      if (response) {
        setUsers(users.filter(user => user.id !== userId));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="tabela-usuarios">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Usuários Cadastrados</h2>
        <button className="btn btn-primary" onClick={() => toggleModal(null, true)}>
          Criar Novo Usuário
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>CEP</th>
            <th>Email</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.cpf}</td>
              <td>{user.phone}</td>
              <td>{user.cep}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => toggleModal(user.id, false)}>
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)} 
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => toggleModal()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {isRegisterModal ? (
              <UserForm toggleModal={toggleModal} /> 
            ) : (
              <UserFormEdit userId={userIdToEdit} toggleModal={toggleModal} /> 
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
