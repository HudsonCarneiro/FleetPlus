import apiRequest from '../utils/apiRequest';
import { getUserIdFromSession, getTokenFromSession } from '../utils/session'; 

export const fetchVehicles = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    return await apiRequest(`/vehicles?userId=${userId}`);
  } catch (error) {
    console.error("Erro ao obter veículos:", error.message);
    throw error;
  }
};

export const fetchVehicleById = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    return await apiRequest(`/vehicle/${id}?userId=${userId}`);
  } catch (error) {
    console.error("Erro ao obter veículo:", error.message);
    throw error;
  }
};

export const registerVehicle = async (vehicleData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    return await apiRequest('/vehicle', 'POST', { ...vehicleData, userId });
  } catch (error) {
    console.error("Erro ao criar veículo:", error.message);
    throw error;
  }
};

export const updateVehicle = async (id, vehicleData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    return await apiRequest(`/vehicle/${id}`, 'PUT', { ...vehicleData, userId });
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error.message);
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    return await apiRequest(`/vehicle/${id}?userId=${userId}`, 'DELETE');
  } catch (error) {
    console.error("Erro ao excluir veículo:", error.message);
    throw error;
  }
};

export const exportVehiclesReport = async () => {
  try {
    const userId = getUserIdFromSession();
    const token = getTokenFromSession();

    if (!userId) throw new Error('Usuário não autenticado.');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicles/report?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(
        `Erro ao exportar veículos: ${errorDetails.message || response.statusText}`
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicles-${userId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar veículos:', error.message);
    throw error;
  }
};

export default {
  fetchVehicles,
  fetchVehicleById,
  registerVehicle,
  updateVehicle,
  deleteVehicle,
  exportVehiclesReport,
};
