import apiRequest from '../utils/apiRequest';
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

// Exportar abastecimentos em PDF
export const exportFuelingsToPDF = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fuelings/report?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao exportar relatório: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fueling-report-${userId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao exportar relatório de abastecimentos:", error.message);
    throw error;
  }
};

export default {
  fetchFuelings,
  fetchFuelingById,
  registerFueling,
  updateFueling,
  deleteFueling,
  exportFuelingsToPDF,
};
