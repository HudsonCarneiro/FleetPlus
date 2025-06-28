import {
  fetchMaintenances,
  fetchMaintenanceById,
  registerMaintenance,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} from "../services/MaintenanceServices";

// Status válidos para manutenção
const VALID_STATUS = ["aberto", "parcelado", "pago"];

// Validação para campos obrigatórios de uma manutenção
const validateMaintenance = (data) => {
  const requiredFields = ["vehicleId", "serviceProviderId", "type", "date", "price"];
  const missingFields = requiredFields.filter(
  (field) =>
    data[field] === undefined ||
    data[field] === null ||
    data[field] === ""
);


  if (missingFields.length > 0) {
    throw new Error(`Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`);
  }

  if (data.status && !VALID_STATUS.includes(data.status)) {
    throw new Error(`Status inválido. Valores permitidos: ${VALID_STATUS.join(", ")}`);
  }
};

// Buscar todas as manutenções
export const handleFetchAllMaintenances = async () => {
  try {
    const maintenances = await fetchMaintenances();

    if (!Array.isArray(maintenances)) {
      throw new Error("Resposta inválida do servidor.");
    }

    // Aqui sim formata tudo bonitinho
    return maintenances.map((m) => ({
      id: m.id,
      type: m.type || "Tipo não informado",
      description: m.description || "-",
      nfe: m.nfe || "-",
      date: m.date
  ? m.date.substring(0, 10).split("-").reverse().join("/")
  : "Data não definida",

      price: Number(m.price || 0), // Preço como número puro
      status: m.status || "Status não definido",
      vehicle: m.vehicle?.model || "Veículo não informado",
      provider: m.serviceProvider?.businessName || "Provedor",
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
      status: maintenance.status || "aberto",
      vehicleId: maintenance.vehicleId,
      serviceProviderId: maintenance.serviceProviderId,
    };
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error.message);
    throw error;
  }
};

// Criar nova manutenção
export const handleMaintenanceRegistration = async (formData) => {
  try {
    validateMaintenance(formData);
    return await registerMaintenance(formData);
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error.message);
    throw error;
  }
};

// Atualizar manutenção
export const handleMaintenanceUpdate = async (id, formData) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    validateMaintenance(formData);
    return await updateMaintenance(id, formData);
  } catch (error) {
    console.error("Erro ao atualizar manutenção:", error.message);
    throw error;
  }
};

// Atualizar status da manutenção com validação
export const handleMaintenanceStatusUpdate = async (id, status) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    if (!status) throw new Error("Status não fornecido.");

    if (!VALID_STATUS.includes(status)) {
      throw new Error(`Status inválido. Valores permitidos: ${VALID_STATUS.join(", ")}`);
    }

    return await updateMaintenanceStatus(id, status);
  } catch (error) {
    console.error("Erro ao atualizar status:", error.message);
    throw error;
  }
};

// Excluir manutenção
export const handleMaintenanceDeletion = async (id) => {
  try {
    if (!id) throw new Error("ID da manutenção não fornecido.");
    return await deleteMaintenance(id);
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error.message);
    throw error;
  }
};
