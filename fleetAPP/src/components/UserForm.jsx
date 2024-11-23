import React, { useState } from 'react';
import { handleUserRegistration } from '../controller/UserController';
import { fetchAddressByCep } from '../utils/CepUtils';
import "../styles/Form.css";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    road: '',
    complement: '',
    number: '',
    city: '',
    state: '',
    email: '',
    password: '',
  });

  // Atualiza o valor dos inputs no estado
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Busca o endereço pelo CEP
  const handleCepBlur = async () => {
    const cep = formData.cep;
    if (cep && cep.length === 8) {
      const address = await fetchAddressByCep(cep);
      if (address) {
        setFormData((prevData) => ({
          ...prevData,
          road: address.logradouro || '',
          city: address.localidade || '',
          state: address.uf || '',
        }));
      }
    } else {
      alert('Digite um CEP válido com 8 números.');
    }
  };

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleUserRegistration(formData);
      if (success) {
        alert('Usuário cadastrado com sucesso!');
      }
    } catch (error) {
      alert('Erro ao cadastrar usuário.');
      console.error(error);
    }
  };

  return (
    <div className="container form-container mt-5 pt-5">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="text-center">Cadastrar Usuário</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {Object.keys(formData).map((key) => (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                </label>
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  id={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  onBlur={key === 'cep' ? handleCepBlur : null} // Adiciona o evento de blur ao CEP
                  className="form-control"
                  placeholder={`Digite o ${key}`}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
