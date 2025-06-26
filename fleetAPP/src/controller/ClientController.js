import {
  fetchClientById,
  fetchClients,
  updateClient,
  deleteClient,
  registerClient,
} from '../services/ClientServices.js';
import Client from '../model/Client.js';
import { fetchAddressByCep } from '../utils/CepUtils.js';

// Buscar todos os clientes
export const handleFetchAllClients = async () => {
  try {
    const clients = await fetchClients();

    if (!clients.length) {
      console.warn('Nenhum cliente encontrado.');
      return [];
    }

    return clients.map((client) => ({
      id: client.id,
      businessName: client.businessName || 'Nome não informado',
      companyName: client.companyName || '',
      cnpj: client.cnpj || '',
      email: client.email || '',
      phone: client.phone || 'Não informado',
      address: client.address
        ? {
            cep: client.address.cep || 'CEP não informado',
            city: client.address.city || 'Cidade não informada',
            state: client.address.state || 'Estado não informado',
          }
        : null,
    }));
  } catch (error) {
    console.error('Erro ao buscar todos os clientes:', error.message);
    throw new Error('Não foi possível buscar os clientes. Tente novamente.');
  }
};

// Buscar cliente por ID
export const handleFetchClientById = async (clientId) => {
  try {
    if (!clientId) throw new Error('ID do cliente não fornecido.');

    const client = await fetchClientById(clientId);

    if (!client) throw new Error('Cliente não encontrado.');

    return {
      id: client.id,
      businessName: client.businessName || 'Nome não informado',
      companyName: client.companyName || '',
      cnpj: client.cnpj || '',
      email: client.email || '',
      phone: client.phone || 'Não informado',
      address: client.address
        ? {
            cep: client.address.cep || 'CEP não informado',
            city: client.address.city || 'Cidade não informada',
            state: client.address.state || 'Estado não informado',
          }
        : null,
    };
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error.message);
    throw new Error('Não foi possível buscar os dados do cliente. Tente novamente.');
  }
};

// Registrar cliente com consulta de CEP
export const handleClientRegistration = async (formData) => {
  try {
    const address = await fetchAddressByCep(formData.cep);
    if (!address) throw new Error('Endereço não encontrado via CEP.');

    const client = new Client(
      formData.businessName,
      formData.companyName,
      formData.cnpj,
      formData.phone,
      formData.email
    );

    const clientPayload = {
      ...client,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: address.logradouro || formData.road,
        complement: formData.complement,
        city: address.localidade || formData.city,
        state: address.uf || formData.state,
      },
    };

    const response = await registerClient(clientPayload);
    console.log('Cliente registrado com sucesso:', response);
    alert('Cliente registrado com sucesso.');
    return response;
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    alert(`Erro ao registrar cliente: ${error.message}`);
    throw error;
  }
};

// Atualizar cliente com revalidação do CEP
export const handleClientUpdate = async (clientId, formData) => {
  try {
    if (!clientId) throw new Error('O ID do cliente é obrigatório.');

    const address = await fetchAddressByCep(formData.cep);
    if (!address) throw new Error('Endereço não encontrado via CEP.');

    const client = new Client(
      formData.businessName,
      formData.companyName,
      formData.cnpj,
      formData.phone,
      formData.email
    );

    const payload = {
      ...client,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: address.logradouro || formData.road,
        complement: formData.complement,
        city: address.localidade || formData.city,
        state: address.uf || formData.state,
      },
    };

    const response = await updateClient(clientId, payload);
    console.log('Cliente atualizado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    alert(`Erro ao atualizar cliente: ${error.message}`);
    throw error;
  }
};

// Excluir cliente
export const handleClientDeletion = async (id) => {
  try {
    if (!id) throw new Error('ID do cliente é obrigatório.');

    const success = await deleteClient(id);

    if (success) {
      console.log('Cliente excluído com sucesso.');
      alert('Cliente excluído com sucesso.');
    } else {
      throw new Error('Erro inesperado ao excluir cliente.');
    }

    return success;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    alert(`Erro ao excluir cliente: ${error.message}`);
    throw error;
  }
};
