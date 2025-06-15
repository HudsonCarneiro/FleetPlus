import apiRequest from "../utils/apiRequest";
import { getUserIdFromSession } from '../utils/session';




export const fetchDeliveryOrders = async () => {
  try {
    const response = await apiRequest('/deliveries');
    return response;
  } catch (error) {
    console.error('Erro ao buscar ordens de entrega:', error.message);
    throw error;
  }
};

export const fetchDeliveryOrderById = async (id) => {
  try {
    if (!id) throw new Error("ID da ordem de entrega não fornecido.");

    const response = await apiRequest(`/delivery/${id}`);
    if (!response) throw new Error("Ordem de entrega não encontrada.");

    return {
      id: response.id,
      client: response.Client?.businessName || "Cliente não informado",
      driver: response.Driver?.name || "Motorista não informado",
      vehicle: response.Vehicle
        ? `${response.Vehicle.model || "Modelo não informado"} (${response.Vehicle.licensePlate || "Placa não informada"})`
        : "Veículo não informado",
      deliveryDate: response.deliveryDate
        ? new Date(response.deliveryDate).toLocaleDateString('pt-BR') 
        : "Data não definida",
      status: response.status || "Status não definido",
      urgency: response.urgency || "Sem prioridade",
    };
  } catch (error) {
    console.error("Erro ao buscar ordem de entrega:", error.message);
    throw error;
  }
};


export const registerDeliveryOrder = async (deliveryOrder) => {
  try {
    return await apiRequest('/delivery', 'POST', deliveryOrder);
  } catch (error) {
    console.error('Erro ao registrar ordem de entrega:', error.message);
    throw error;
  }
};

export const updateDeliveryOrder = async (id, updatedDeliveryOrder) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');
    return await apiRequest(`/delivery/${id}`, 'PUT', updatedDeliveryOrder);
  } catch (error) {
    console.error('Erro ao atualizar ordem de entrega:', error.message);
    throw error;
  }
};

export const updateDeliveryOrderStatus = async (id, status) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');
    return await apiRequest(`/delivery/${id}/status`, 'PATCH', { status });
  } catch (error) {
    console.error('Erro ao atualizar status da ordem de entrega:', error.message);
    throw error;
  }
};

export const deleteDeliveryOrder = async (id) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');
    return await apiRequest(`/delivery/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir ordem de entrega:', error.message);
    throw error;
  }
};

export const fetchClients = async () => {
  try {
    return await apiRequest('/clients/');
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};

export const fetchVehicles = async () => {
  try {
    return await apiRequest('/vehicles/');
  } catch (error) {
    console.error('Erro ao buscar veículos:', error.message);
    throw error;
  }
};

export const fetchDrivers = async () => {
  try {
    return await apiRequest('/drivers/');
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error.message);
    throw error;
  }
};

export const exportDeliveryOrdersToPDF = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await apiRequest(`/deliveries/report`, 'GET', null, { userId }, true); // true = isBinary

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-entregas-${userId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar ordens de entrega:', error.message);
    throw error;
  }
};

export default {
  fetchDeliveryOrders,
  fetchDeliveryOrderById,
  registerDeliveryOrder,
  updateDeliveryOrder,
  updateDeliveryOrderStatus,
  deleteDeliveryOrder,
  exportDeliveryOrdersToPDF,
  fetchClients,
  fetchVehicles,
  fetchDrivers,
};
