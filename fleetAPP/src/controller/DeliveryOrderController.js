import {
    fetchDeliveryOrders,
    fetchDeliveryOrderById,
    registerDeliveryOrder,
    updateDeliveryOrder,
    updateDeliveryOrderStatus,
    deleteDeliveryOrder,
    exportDeliveryOrdersToTxt,
  } from "../services/DeliveryOrderServices";
  import { toast } from "react-toastify"; // Notificação amigável para o usuário
  
  // Validação para campos obrigatórios de uma ordem de entrega
  const validateDeliveryOrder = (data) => {
    const requiredFields = ["clientId", "driverId", "vehicleId"];
    const missingFields = requiredFields.filter((field) => !data[field]);
  
    if (missingFields.length > 0) {
      throw new Error(
        `Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`
      );
    }
  
    // Validação para status e urgência
    const validStatuses = ["aguardando", "enviado", "finalizado"];
    const validUrgencies = ["verde", "amarela", "vermelha"];
  
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error(
        `Status inválido. Valores permitidos: ${validStatuses.join(", ")}`
      );
    }
  
    if (data.urgency && !validUrgencies.includes(data.urgency)) {
      throw new Error(
        `Urgência inválida. Valores permitidos: ${validUrgencies.join(", ")}`
      );
    }
  };
  
  // Buscar todas as ordens de entrega
  export const handleFetchAllDeliveryOrders = async () => {
    try {
      const deliveryOrders = await fetchDeliveryOrders();
      if (!deliveryOrders.length) {
        console.warn("Nenhuma ordem de entrega encontrada.");
        return [];
      }
      return deliveryOrders;
    } catch (error) {
      console.error("Erro ao buscar todas as ordens de entrega:", error.message);
      toast.error("Erro ao buscar ordens de entrega. Tente novamente.");
      throw error;
    }
  };
  
  // Buscar uma ordem de entrega por ID
  export const handleFetchDeliveryOrderById = async (id) => {
    try {
      if (!id) throw new Error("ID da ordem de entrega não fornecido.");
      const deliveryOrder = await fetchDeliveryOrderById(id);
      if (!deliveryOrder) {
        throw new Error("Ordem de entrega não encontrada.");
      }
      return deliveryOrder;
    } catch (error) {
      console.error("Erro ao buscar ordem de entrega por ID:", error.message);
      toast.error("Erro ao buscar a ordem de entrega. Tente novamente.");
      throw error;
    }
  };
  
  // Criar uma nova ordem de entrega
  export const handleDeliveryOrderRegistration = async (formData) => {
    try {
      validateDeliveryOrder(formData); // Valida os campos obrigatórios
  
      const response = await registerDeliveryOrder(formData);
      console.log("Ordem de entrega registrada com sucesso:", response);
      toast.success("Ordem de entrega registrada com sucesso!");
      return response;
    } catch (error) {
      console.error("Erro ao registrar ordem de entrega:", error.message);
      toast.error(
        `Erro ao registrar ordem de entrega: ${error.message}. Verifique os dados fornecidos.`
      );
      throw error;
    }
  };
  
  // Atualizar uma ordem de entrega
  export const handleDeliveryOrderUpdate = async (id, formData) => {
    try {
      if (!id) throw new Error("ID da ordem de entrega não fornecido.");
      validateDeliveryOrder(formData); // Valida os campos obrigatórios
  
      const response = await updateDeliveryOrder(id, formData);
      console.log("Ordem de entrega atualizada com sucesso:", response);
      toast.success("Ordem de entrega atualizada com sucesso!");
      return response;
    } catch (error) {
      console.error("Erro ao atualizar ordem de entrega:", error.message);
      toast.error(
        `Erro ao atualizar ordem de entrega: ${error.message}. Verifique os dados fornecidos.`
      );
      throw error;
    }
  };
  
  // Atualizar apenas o status de uma ordem de entrega
  export const handleDeliveryOrderStatusUpdate = async (id, status) => {
    try {
      if (!id) throw new Error("ID da ordem de entrega não fornecido.");
      if (!status) throw new Error("Status não fornecido.");
  
      const response = await updateDeliveryOrderStatus(id, status);
      console.log("Status da ordem de entrega atualizado com sucesso:", response);
      toast.success("Status atualizado com sucesso!");
      return response;
    } catch (error) {
      console.error("Erro ao atualizar status da ordem de entrega:", error.message);
      toast.error("Erro ao atualizar o status. Tente novamente.");
      throw error;
    }
  };
  
  // Excluir uma ordem de entrega
  export const handleDeliveryOrderDeletion = async (id) => {
    try {
      if (!id) throw new Error("ID da ordem de entrega não fornecido.");
  
      const success = await deleteDeliveryOrder(id);
      if (success) {
        console.log("Ordem de entrega excluída com sucesso.");
        toast.success("Ordem de entrega excluída com sucesso!");
      } else {
        throw new Error("Erro inesperado ao excluir a ordem de entrega.");
      }
      return success;
    } catch (error) {
      console.error("Erro ao excluir ordem de entrega:", error.message);
      toast.error("Erro ao excluir a ordem de entrega. Tente novamente.");
      throw error;
    }
  };
  
  // Exportar todas as ordens de entrega para um arquivo .txt
  export const handleExportDeliveryOrdersToTxt = async () => {
    try {
      await exportDeliveryOrdersToTxt();
      toast.success("Arquivo gerado com sucesso. O download foi iniciado.");
    } catch (error) {
      console.error("Erro ao exportar ordens de entrega:", error.message);
      toast.error("Erro ao exportar ordens de entrega. Tente novamente.");
      throw error;
    }
  };
  