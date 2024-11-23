import React, { useState } from 'react';
import { handleUserRegistration } from '../controller/UserController';
import { fetchAddressByCep } from '../utils/CepUtils';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import "../styles/Form.css";

const UserForm = () => {
  const navigate = useNavigate(); // Usando o hook useNavigate
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUserRegistration(formData, navigate);
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
                  onBlur={key === 'cep' ? handleCepBlur : null}
                  className="form-control"
                  placeholder={`Digite ${
                    (() => {
                      switch (key) {
                        case 'name': return 'seu nome';
                        case 'cpf': return 'seu CPF';
                        case 'phone': return 'seu telefone';
                        case 'cep': return 'seu CEP';
                        case 'number': return 'seu número';
                        case 'road': return 'sua rua';
                        case 'complement': return 'seu complemento';
                        case 'city': return 'sua cidade';
                        case 'state': return 'seu estado';
                        case 'email': return 'seu e-mail';
                        case 'password': return 'sua senha';
                        default: return key;
                      }
                    })()
                  }`}
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
