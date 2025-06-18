import apiRequest from '../utils/apiRequest';

export const fetchDrivers = async () => {
  try {
    return await apiRequest('/drivers');
  } catch (error) {
    console.error('Erro ao obter motoristas:', error.message);
    throw error;
  }
};

export const fetchDriverById = async (id) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    return await apiRequest(`/driver/${id}`);
  } catch (error) {
    console.error('Erro ao obter motorista:', error.message);
    throw error;
  }
};

export const registerDriver = async (driverData) => {
  try {
    if (!driverData || typeof driverData !== 'object') {
      throw new Error('Dados inválidos para criação de motorista.');
    }
    return await apiRequest('/driver', 'POST', driverData);
  } catch (error) {
    console.error('Erro ao criar motorista:', error.message);
    throw error;
  }
};

export const updateDriver = async (id, driverData) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    if (!driverData || typeof driverData !== 'object') {
      throw new Error('Dados inválidos para atualização de motorista.');
    }
    return await apiRequest(`/driver/${id}`, 'PUT', driverData);
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error.message);
    throw error;
  }
};

export const deleteDriver = async (id) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    return await apiRequest(`/driver/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir motorista:', error.message);
    throw error;
  }
};

export default {
  fetchDrivers,
  fetchDriverById,
  registerDriver,
  updateDriver,
  deleteDriver,
};
