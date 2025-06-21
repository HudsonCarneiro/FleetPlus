import apiRequest from '../utils/ApiRequest';

export const fetchServiceProviders = async () => {
  try {
    return await apiRequest('/serviceProviders');
  } catch (error) {
    console.error('Erro ao obter prestadores de serviço:', error.message);
    throw error;
  }
};

export const fetchServiceProviderById = async (id) => {
  try {
    if (!id) throw new Error('ID do prestador de serviço não fornecido.');
    return await apiRequest(`/serviceProvider/${id}`);
  } catch (error) {
    console.error('Erro ao obter prestador de serviço:', error.message);
    throw error;
  }
};

export const registerServiceProvider = async (providerData) => {
  try {
    if (!providerData || typeof providerData !== 'object') {
      throw new Error('Dados inválidos para criação de prestador de serviço.');
    }
    return await apiRequest('/serviceProvider', 'POST', providerData);
  } catch (error) {
    console.error('Erro ao criar prestador de serviço:', error.message);
    throw error;
  }
};

export const updateServiceProvider = async (id, providerData) => {
  try {
    if (!id) throw new Error('ID do prestador de serviço não fornecido.');
    if (!providerData || typeof providerData !== 'object') {
      throw new Error('Dados inválidos para atualização de prestador de serviço.');
    }
    return await apiRequest(`/serviceProvider/${id}`, 'PUT', providerData);
  } catch (error) {
    console.error('Erro ao atualizar prestador de serviço:', error.message);
    throw error;
  }
};

export const deleteServiceProvider = async (id) => {
  try {
    if (!id) throw new Error('ID do prestador de serviço não fornecido.');
    return await apiRequest(`/serviceProvider/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir prestador de serviço:', error.message);
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
