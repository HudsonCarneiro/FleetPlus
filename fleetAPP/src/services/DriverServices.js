// URL base da API (ajuste conforme necessário)
const API_URL = 'http://localhost:3000/api';

// Obtém o ID do usuário logado da sessão (localStorage)
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Função para obter todos os motoristas do usuário logado
export const getAllDrivers = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/drivers?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao obter motoristas: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter motoristas:', error.message);
    throw error;
  }
};

// Função para obter um motorista pelo ID (vinculado ao usuário logado)
export const getDriverById = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/driver/${id}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao obter motorista: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter motorista:', error.message);
    throw error;
  }
};

// Função para criar um novo motorista
export const createDriver = async (driverData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/driver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...driverData, userId }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao criar motorista: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar motorista:', error.message);
    throw error;
  }
};

// Função para atualizar um motorista (vinculado ao usuário logado)
export const updateDriver = async (id, driverData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/driver/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...driverData, userId }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar motorista: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error.message);
    throw error;
  }
};

// Função para excluir um motorista (vinculado ao usuário logado)
export const deleteDriver = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/driver/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir motorista: ${response.statusText}`);
    }
    return response.status === 204;
  } catch (error) {
    console.error('Erro ao excluir motorista:', error.message);
    throw error;
  }
};
