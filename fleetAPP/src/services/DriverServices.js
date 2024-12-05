// URL base da API (ajuste conforme necessário)
const API_URL = 'http://localhost:3000/api';

// Função para obter todos os motoristas
export const getAllDrivers = async () => {
  try {
    const response = await fetch(`${API_URL}/drivers`);
    if (!response.ok) {
      throw new Error(`Erro ao obter motoristas: ${response.statusText}`);
    }
    return await response.json(); // Retorna os motoristas
  } catch (error) {
    console.error('Erro ao obter motoristas:', error.message);
    throw error;
  }
};

// Função para obter um motorista pelo ID
export const getDriverById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/driver/${id}`);
    if (!response.ok) {
      throw new Error(`Erro ao obter motorista: ${response.statusText}`);
    }
    return await response.json(); // Retorna os dados do motorista
  } catch (error) {
    console.error('Erro ao obter motorista:', error.message);
    throw error;
  }
};

// Função para criar um novo motorista
export const createDriver = async (driverData) => {
  try {
    const response = await fetch(`${API_URL}/driver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData), // Converte os dados para JSON
    });
    if (!response.ok) {
      throw new Error(`Erro ao criar motorista: ${response.statusText}`);
    }
    return await response.json(); // Retorna o motorista criado
  } catch (error) {
    console.error('Erro ao criar motorista:', error.message);
    throw error;
  }
};

// Função para atualizar um motorista existente
export const updateDriver = async (id, driverData) => {
  try {
    const response = await fetch(`${API_URL}/driver/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData), // Converte os dados para JSON
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar motorista: ${response.statusText}`);
    }
    return await response.json(); // Retorna o motorista atualizado
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error.message);
    throw error;
  }
};

// Função para excluir um motorista
export const deleteDriver = async (id) => {
  try {
    const response = await fetch(`${API_URL}/driver/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir motorista: ${response.statusText}`);
    }
    return response.status === 204; // Retorna true se o status for 204 (sem conteúdo)
  } catch (error) {
    console.error('Erro ao excluir motorista:', error.message);
    throw error;
  }
};
