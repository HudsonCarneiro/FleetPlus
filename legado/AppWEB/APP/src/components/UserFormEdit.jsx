import React, { useState, useEffect } from 'react';
import { handleUpdateUser, handleFetchUserById } from '../controller/UserController';
import { fetchAddressByCep } from '../utils/CepUtils';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/Form.css";

const UserFormEdit = ({ fetchUserById }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    number: '',
    road: '',
    city: '',
    state: '',
    email: '',
    password: '',
    status: 'Ativo',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await handleFetchUserById(id); // Busca os dados não sensíveis
        if (user) {
          setFormData({
            name: user.name || '',
            cpf: user.cpf || '',
            phone: user.phone || '',
            cep: user.cep || '',
            number: user.number || '',
            road: user.road || '',
            city: user.city || '',
            state: user.state || '',
            email: user.email || '',
            password: '', 
            status: user.status || 'Ativo',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar o usuário:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadUser();
  }, [id]);

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
    setLoading(true);

    const updated = await handleUpdateUser(id, formData);
    if (updated) {
      alert('Usuário atualizado com sucesso!');
      navigate('/users'); // Redireciona para a lista de usuários
    } else {
      alert('Erro ao atualizar o usuário. Verifique os dados e tente novamente.');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return (
    <div className="container form-container mt-5 pt-5">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="text-center">Editar Usuário</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {Object.keys(formData).map((key) => (
              key !== 'password' && ( // Oculta o campo de senha
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
                        case 'city': return 'Cidade';
                        case 'state': return 'Estado';
                        case 'email': return 'E-mail';
                        case 'status': return 'Status';
                        default: return key;
                      }
                    })()}
                  </label>
                  {key === 'status' ? (
                    <select
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      onBlur={key === 'cep' ? handleCepBlur : null}
                      className="form-control"
                      placeholder={`Digite ${key === 'name' ? 'seu nome' : ''}`}
                    />
                  )}
                </div>
              )
            ))}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormEdit;
