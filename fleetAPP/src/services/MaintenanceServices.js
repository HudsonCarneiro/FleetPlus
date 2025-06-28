import apiRequest from "../utils/ApiRequest";
import { fetchVehicles } from "./VehicleServices";
import { fetchServiceProviders } from "./ServiceProviderServices";

/** Status válidos do modelo */
export const MAINTENANCE_STATUSES = ["aberto", "parcelado", "pago"];

/** Validação de campos obrigatórios e de status */
const validateMaintenance = (data) => {
  const requiredFields = ["vehicleId", "serviceProviderId", "type", "date", "price"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`);
  }

  if (data.status && !MAINTENANCE_STATUSES.includes(data.status)) {
    throw new Error(
      `Status inválido. Permitidos: ${MAINTENANCE_STATUSES.join(", ")}`
    );
  }
};

export const fetchMaintenances = async () => {
  try {
    const response = await apiRequest("/maintenances");

    if (!Array.isArray(response)) {
      throw new Error("Resposta inválida do servidor.");
    }

    // Retorna dados brutos, sem map
    return response;
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error.message);
    throw error;
  }
};


//  Buscar manutenção por ID (para edição)
export const fetchMaintenanceById = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");

    const response = await apiRequest(`/maintenances/${id}`);

    // Retorna dados crus para preencher o formulário
    return {
      id: response.id,
      type: response.type,
      description: response.description || "",
      nfe: response.nfe || "",
      date: response.date
        ? new Date(response.date).toISOString().substr(0, 10)
        : "",
      price: response.price,
      status: response.status || "aberto",
      vehicleId: response.vehicleId,
      serviceProviderId: response.serviceProviderId,
    };
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error.message);
    throw error;
  }
};

//  Registrar nova manutenção
export const registerMaintenance = async (maintenance) => {
  try {
    validateMaintenance(maintenance);
    return await apiRequest("/maintenances", "POST", maintenance);
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error.message);
    throw error;
  }
};

// Atualizar manutenção existente
export const updateMaintenance = async (id, updatedMaintenance) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    validateMaintenance(updatedMaintenance);
    return await apiRequest(`/maintenances/${id}`, "PUT", updatedMaintenance);
  } catch (error) {
    console.error("Erro ao atualizar manutenção:", error.message);
    throw error;
  }
};

//  Atualizar status da manutenção
export const updateMaintenanceStatus = async (id, status) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    if (!MAINTENANCE_STATUSES.includes(status)) {
      throw new Error(
        `Status inválido. Permitidos: ${MAINTENANCE_STATUSES.join(", ")}`
      );
    }
    return await apiRequest(`/maintenances/${id}/status`, "PATCH", { status });
  } catch (error) {
    console.error("Erro ao atualizar status da manutenção:", error.message);
    throw error;
  }
};

// Excluir manutenção
export const deleteMaintenance = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    return await apiRequest(`/maintenances/${id}`, "DELETE");
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error.message);
    throw error;
  }
};

// Reexporta métodos de serviços auxiliares
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
