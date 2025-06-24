import apiRequest from '../utils/ApiRequest';
import { getUserIdFromSession } from '../utils/session'; 

export const fetchFuelings = async () => {
  try {
    const fuelings = await apiRequest('/fuelings');
    if (Array.isArray(fuelings) && fuelings.length === 0) {
      console.log("Nenhum abastecimento cadastrado");
      return [];
    }
    return fuelings;
  } catch (error) {
    console.error('Erro ao buscar abastecimentos:', error.message);
    throw error;
  }
};

// Buscar um abastecimento pelo ID
export const fetchFuelingById = async (id) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    return await apiRequest(`/fueling/${id}`);
  } catch (error) {
    console.error('Erro ao buscar abastecimento:', error.message);
    throw error;
  }
};

// Registrar um novo abastecimento
export const registerFueling = async (fuelingData) => {
  try {
    return await apiRequest('/fueling', 'POST', fuelingData);
  } catch (error) {
    console.error('Erro ao registrar abastecimento:', error.message);
    throw error;
  }
};

// Atualizar abastecimento existente
export const updateFueling = async (id, updatedFueling) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    return await apiRequest(`/fueling/${id}`, 'PUT', updatedFueling);
  } catch (error) {
    console.error('Erro ao atualizar abastecimento:', error.message);
    throw error;
  }
};

// Excluir abastecimento
export const deleteFueling = async (id) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    return await apiRequest(`/fueling/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir abastecimento:', error.message);
    throw error;
  }
};

export default {
  fetchFuelings,
  fetchFuelingById,
  registerFueling,
  updateFueling,
  deleteFueling,
};
