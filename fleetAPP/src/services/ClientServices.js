import apiRequest from '../utils/apiRequest';

// Busca todos os clientes
export const fetchClients = async () => {
  try {
    const response = await apiRequest('/clients/');
    console.log('clients: ', response);
    return response || [];
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};

// Busca cliente pelo ID
export const fetchClientById = async (id) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');
    return await apiRequest(`/client/${id}`);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message);
    throw error;
  }
};

// Registra novo cliente
export const registerClient = async (client) => {
  try {
    return await apiRequest('/client', 'POST', client);
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    throw error;
  }
};

// Atualiza cliente existente
export const updateClient = async (id, updatedClient) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');
    if (!updatedClient || typeof updatedClient !== 'object') {
      throw new Error('Dados do cliente inválidos ou não fornecidos.');
    }
    return await apiRequest(`/client/${id}`, 'PUT', updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw error;
  }
};

// Exclui cliente
export const deleteClient = async (id) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');
    return await apiRequest(`/client/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    throw error;
  }
};

export default {
  registerClient,
  fetchClients,
  fetchClientById,
  updateClient,
  deleteClient,
};
