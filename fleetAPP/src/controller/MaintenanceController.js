import {
  fetchMaintenances,
  fetchMaintenanceById,
  registerMaintenance,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} from "../services/MaintenanceServices";
import { toast } from "react-toastify";

// Validação para campos obrigatórios de uma manutenção
const validateMaintenance = (data) => {
  const requiredFields = ["vehicleId", "serviceProviderId", "type", "date", "price"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`);
  }

  if (data.status && !["pendente", "em andamento", "finalizado"].includes(data.status)) {
    throw new Error("Status inválido. Valores permitidos: pendente, em andamento, finalizado");
  }
};

// Buscar todas as manutenções
export const handleFetchAllMaintenances = async () => {
  try {
    const maintenances = await fetchMaintenances();

    if (!Array.isArray(maintenances)) {
      throw new Error("Resposta inválida do servidor.");
    }

    return maintenances.map((m) => ({
      id: m.id,
      type: m.type || "Tipo não informado",
      description: m.description || "-",
      nfe: m.nfe || "-",
      date: m.date ? new Date(m.date).toLocaleDateString("pt-BR") : "Data não definida",
      price: `R$ ${Number(m.price || 0).toFixed(2)}`,
      status: m.status || "Status não definido",
      vehicle: m.vehicle?.model || "Veículo não informado",
      provider: m.provider?.businessName || "Fornecedor não informado",
    }));
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error.message);
    throw error;
  }
};

// Buscar uma manutenção por ID
export const handleFetchMaintenanceById = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    const maintenance = await fetchMaintenanceById(id);

    return {
      id: maintenance.id,
      type: maintenance.type,
      description: maintenance.description || "",
      nfe: maintenance.nfe || "",
      date: maintenance.date ? new Date(maintenance.date).toISOString().substr(0, 10) : "",
      price: maintenance.price,
      status: maintenance.status || "pendente",
      vehicleId: maintenance.vehicleId,
      serviceProviderId: maintenance.serviceProviderId,
    };
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error.message);
    toast.error("Erro ao carregar manutenção.");
    throw error;
  }
};

// Criar nova manutenção
export const handleMaintenanceRegistration = async (formData) => {
  try {
    validateMaintenance(formData);

    const result = await registerMaintenance(formData);
    toast.success("Manutenção registrada com sucesso!");
    return result;
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error.message);
    toast.error(`Erro ao registrar manutenção: ${error.message}`);
    throw error;
  }
};

// Atualizar manutenção
export const handleMaintenanceUpdate = async (id, formData) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    validateMaintenance(formData);

    const result = await updateMaintenance(id, formData);
    toast.success("Manutenção atualizada com sucesso!");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar manutenção:", error.message);
    toast.error(`Erro ao atualizar manutenção: ${error.message}`);
    throw error;
  }
};

// Atualizar status da manutenção
export const handleMaintenanceStatusUpdate = async (id, status) => {
  try {
    if (!id || !status) throw new Error("ID ou status não fornecido.");

    const result = await updateMaintenanceStatus(id, status);
    toast.success("Status atualizado com sucesso!");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar status:", error.message);
    toast.error("Erro ao atualizar status. Tente novamente.");
    throw error;
  }
};

// Excluir manutenção
export const handleMaintenanceDeletion = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");

    const result = await deleteMaintenance(id);
    toast.success("Manutenção excluída com sucesso!");
    return result;
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error.message);
    toast.error("Erro ao excluir manutenção. Tente novamente.");
    throw error;
  }
};
