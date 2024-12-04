import React, { useState, useEffect } from 'react';
import "../styles/Modal.css";
import { handleUserUpdate, handleUserDeletion, handleFetchUserById } from '../controller/UserController';

const UserModal = ({ userId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    number: '',
    road: '',
    complement: '',
    city: '',
    state: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await handleFetchUserById(userId);
      if (user) {
        setFormData(user);
      } else {
        console.error('Erro ao buscar os dados do usuário.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleUpdate = async () => {
    const updatedUser = await handleUserUpdate(userId, formData);
    if (updatedUser) {
      console.log('Usuário atualizado com sucesso');
      onClose();
    } else {
      console.error('Erro ao atualizar o usuário');
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (confirmDeletion) {
      const deleted = await handleUserDeletion(userId, formData.addressId);
      if (deleted) {
        console.log('Usuário excluído com sucesso');
        onClose();
      } else {
        console.error('Erro ao excluir o usuário');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>&times;</button>
        <h3 className="text-center">Editar Usuário</h3>
        <form className="mt-4">
          <div className="row">
            {Object.keys(formData).map((key) => (
              <div className="col-md-6 mb-3" key={key}>
                <label className="form-label" htmlFor={key}>
                  {(() => {
                    switch (key) {
                      case 'name': return 'Nome';
                      case 'cpf': return 'CPF';
                      case 'phone': return 'Telefone';
                      case 'cep': return 'CEP';
                      case 'number': return 'Número';
                      case 'road': return 'Rua';
                      case 'complement': return 'Complemento';
                      case 'city': return 'Cidade';
                      case 'state': return 'Estado';
                      case 'email': return 'E-mail';
                      case 'password': return 'Senha';
                      default: return key;
                    }
                  })()}
                </label>
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  id={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly={['cpf', 'email'].includes(key)}
                />
              </div>
            ))}
          </div>
        </form>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
          <button className="btn btn-primary" onClick={handleUpdate}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
