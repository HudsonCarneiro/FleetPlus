import apiRequest from '../utils/ApiRequest';
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

export default {
  fetchVehicles,
  fetchVehicleById,
  registerVehicle,
  updateVehicle,
  deleteVehicle,
};
