import React, { useState } from 'react';
import { fetchAddressByCep } from '../utils/CepUtils';
import { registerUser, registerAddress } from '../services/userServices';
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      const address = await fetchAddressByCep(formData.cep);
      if (address) {
        setFormData((prevData) => ({
          ...prevData,
          road: address.logradouro,
          city: address.localidade,
          state: address.uf,
        }));
      }
    } else {
      alert('Digite um CEP válido com 8 números.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const addressId = await registerAddress({
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
      });

      const newUser = await registerUser({
        name: formData.name,
        cpf: formData.cpf,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        addressId,
      });

      alert('Usuário cadastrado com sucesso!');
      console.log('Usuário cadastrado:', newUser);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <div className="container form-container mt-5 pt-5">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="text-center">Cadastrar Usuário</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {/** Campos do formulário */}
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
                  className="form-control"
                  placeholder={`Digite o ${key}`}
                  onBlur={key === 'cep' ? handleCepBlur : null}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
