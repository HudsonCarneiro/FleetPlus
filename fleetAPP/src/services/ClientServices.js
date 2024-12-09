
// URL base da API
const API_URL = 'http://localhost:3000/api';

// Obtém o ID do usuário logado do localStorage
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Função para registrar um cliente com endereço
export const registerClient = async (client) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    client.userId = userId;

    const response = await fetch(`${API_URL}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Erro ao registrar cliente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    throw error;
  }
};

// Função para buscar todos os clientes do usuário logado
export const fetchClients = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/clients?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};

// Função para buscar um cliente pelo ID
export const fetchClientById = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/client/${id}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message);
    throw error;
  }
};

// Função para atualizar um cliente e endereço
export const updateClient = async (id, updatedClient) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/client/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedClient, userId }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar cliente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw error;
  }
};

// Função para excluir um cliente
export const deleteClient = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/client/${id}?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir cliente: ${response.statusText}`);
    }
    return response.status === 204;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    throw error;
  }
};

// Exporta todas as funções juntas
export default {
  registerClient,
  fetchClients,
  fetchClientById,
  updateClient,
  deleteClient,
};
