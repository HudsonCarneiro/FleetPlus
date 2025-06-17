import apiRequest from '../utils/apiRequest';

export const fetchServiceProviders = async () => {
  try {
    return await apiRequest('/serviceProviders');
  } catch (error) {
    console.error('Erro ao obter prestador de servico:', error.message);
    throw error;
  }
};

export const fetchServiceProviderById = async (id) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    return await apiRequest(`/serviceProvider/${id}`);
  } catch (error) {
    console.error('Erro ao obter prestador de servico::', error.message);
    throw error;
  }
};

export const registerServiceProvider = async (driverData) => {
  try {
    if (!driverData || typeof driverData !== 'object') {
      throw new Error('Dados inválidos para criação de motorista.');
    }
    return await apiRequest('/serviceProvider', 'POST', driverData);
  } catch (error) {
    console.error('Erro ao criar motorista:', error.message);
    throw error;
  }
};

export const updateServiceProvider = async (id, driverData) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    if (!driverData || typeof driverData !== 'object') {
      throw new Error('Dados inválidos para atualização de motorista.');
    }
    return await apiRequest(`/serviceProvider/${id}`, 'PUT', driverData);
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error.message);
    throw error;
  }
};

export const deleteServiceProvider = async (id) => {
  try {
    if (!id) throw new Error('ID do motorista não fornecido.');
    return await apiRequest(`/serviceProvider/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir motorista:', error.message);
    throw error;
  }
};

export default {
  fetchServiceProviders,
  fetchServiceProviderById,
  registerServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
};
