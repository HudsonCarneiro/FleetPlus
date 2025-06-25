import apiRequest from "../utils/ApiRequest";
import { fetchVehicles } from "./VehicleServices";
import { fetchServiceProviders } from "./ServiceProviderServices";

// Buscar todas as manutenções
export const fetchMaintenances = async () => {
  try {
    const response = await apiRequest("/maintenances");
    return response;
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error.message);
    throw error;
  }
};

// Buscar manutenção por ID
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
        ? new Date(response.date).toLocaleDateString("pt-BR")
        : "Data não definida",
      price: response.price
        ? `R$ ${Number(response.price).toFixed(2)}`
        : "Valor não informado",
      status: response.status || "Status não definido",
      vehicle: response.vehicle?.model || "Veículo não informado",
      provider: response.provider?.businessName || "Fornecedor não informado",
    };
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error.message);
    throw error;
  }
};

// Registrar nova manutenção
export const registerMaintenance = async (maintenance) => {
  try {
    return await apiRequest("/maintenance", "POST", maintenance);
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error.message);
    throw error;
  }
};

// Atualizar manutenção existente
export const updateMaintenance = async (id, updatedMaintenance) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    return await apiRequest(`/maintenance/${id}`, "PUT", updatedMaintenance);
  } catch (error) {
    console.error("Erro ao atualizar manutenção:", error.message);
    throw error;
  }
};

// Atualizar status da manutenção
export const updateMaintenanceStatus = async (id, status) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    return await apiRequest(`/maintenance/${id}/status`, "PATCH", { status });
  } catch (error) {
    console.error("Erro ao atualizar status da manutenção:", error.message);
    throw error;
  }
};

// Excluir manutenção
export const deleteMaintenance = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    return await apiRequest(`/maintenance/${id}`, "DELETE");
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error.message);
    throw error;
  }
};

// Reexporta os métodos externos para manter compatibilidade
export { fetchVehicles, fetchServiceProviders };

// Exportação default agrupada
export default {
  fetchMaintenances,
  fetchMaintenanceById,
  registerMaintenance,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
  fetchVehicles,
  fetchServiceProviders,
};
