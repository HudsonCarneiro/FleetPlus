import apiRequest from "../utils/ApiRequest";
import { getUserIdFromSession } from "../utils/session";

export const fetchMaintenances = async () => {
  try {
    const response = await apiRequest('/maintenances');
    return response;
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error.message);
    throw error;
  }
};

export const fetchMaintenanceById = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");

    const response = await apiRequest(`/maintenance/${id}`);
    if (!response) throw new Error("Manutenção não encontrada.");

    return {
      id: response.id,
      type: response.type || "Tipo não informado",
      description: response.description || "-",
      nfe: response.nfe || "-",
      date: response.date
        ? new Date(response.date).toLocaleDateString('pt-BR')
        : "Data não definida",
      price: response.price ? `R$ ${Number(response.price).toFixed(2)}` : "Valor não informado",
      status: response.status || "Status não definido",
      vehicle: response.vehicle?.model || "Veículo não informado",
      provider: response.provider?.businessName || "Fornecedor não informado",
    };
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error.message);
    throw error;
  }
};

export const registerMaintenance = async (maintenance) => {
  try {
    return await apiRequest('/maintenance', 'POST', maintenance);
  } catch (error) {
    console.error('Erro ao registrar manutenção:', error.message);
    throw error;
  }
};

export const updateMaintenance = async (id, updatedMaintenance) => {
  try {
    if (!id) throw new Error('ID da manutenção não fornecido.');
    return await apiRequest(`/maintenance/${id}`, 'PUT', updatedMaintenance);
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error.message);
    throw error;
  }
};

export const updateMaintenanceStatus = async (id, status) => {
  try {
    if (!id) throw new Error('ID da manutenção não fornecido.');
    return await apiRequest(`/maintenance/${id}/status`, 'PATCH', { status });
  } catch (error) {
    console.error('Erro ao atualizar status da manutenção:', error.message);
    throw error;
  }
};

export const deleteMaintenance = async (id) => {
  try {
    if (!id) throw new Error('ID da manutenção não fornecido.');
    return await apiRequest(`/maintenance/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir manutenção:', error.message);
    throw error;
  }
};

export const fetchServiceProviders = async () => {
  try {
    return await apiRequest('/serviceProviders');
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error.message);
    throw error;
  }
};

export const fetchVehicles = async () => {
  try {
    return await apiRequest('/vehicles');
  } catch (error) {
    console.error('Erro ao buscar veículos:', error.message);
    throw error;
  }
};

export const exportMaintenancesToPDF = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await apiRequest(`/maintenances/report`, 'GET', null, { userId }, true); // isBinary = true
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-manutencao-${userId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar relatório de manutenções:', error.message);
    throw error;
  }
};

export default {
  fetchMaintenances,
  fetchMaintenanceById,
  registerMaintenance,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
  exportMaintenancesToPDF,
  fetchServiceProviders,
  fetchVehicles,
};
