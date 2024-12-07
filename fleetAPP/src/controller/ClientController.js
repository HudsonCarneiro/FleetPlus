import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
  } from "../services/ClientServices.js";
  
  // Função para validar campos obrigatórios
  const validateClientFields = (formData, fields) => {
    for (const field of fields) {
      if (!formData[field]) {
        throw new Error(`Campo obrigatório "${field}" ausente.`);
      }
    }
  };
  
  export const handleFetchAllClients = async () => {
    try {
      const clients = await getAllClients();
  
      if (!clients || vclients.length === 0) {
        console.warn("Nenhum registro de cliente encontrado.");
        return [];
      }
  
      return clients;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error.message);
      return [];
    }
  };
  
  export const handleFetchClientById = async (id) => {
    try {
      const client = await getClientById(id);
  
      if (!client) {
        throw new Error("Client não encontrado.");
      }
  
      return client;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error.message);
      return null;
    }
  };
  
  export const handleClientRegistration = async (formData) => {
    try {
      // Validação de campos obrigatórios
      validateClientFields(formData, ["businessName", "companyName", "cnpj", ]);
  
      // Validação adicional para placa (padrão Mercosul)
      // const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
      // if (!plateRegex.test(formData.plate)) {
      //   throw new Error("Digite uma PLACA válida no formato Mercosul (AAA0A00).");
      // }
  
      const vehicleResponse = await createVehicle(formData);
  
      if (vehicleResponse) {
        console.log("Veículo cadastrado com sucesso:", vehicleResponse);
        return vehicleResponse;
      } else {
        throw new Error("Erro ao registrar veículo no services.");
      }
    } catch (error) {
      console.error("Erro no registro do veículo:", error.message);
      return null;
    }
  };
  
  export const handleVehicleUpdate = async (formData) => {
    try {
      // Validação de campos obrigatórios
      validateVehicleFields(formData, ["plate", "model", "year", "fuelType"]);
  
      const vehicleResponse = await updateVehicle(formData.id, formData);
  
      if (vehicleResponse) {
        console.log("Veículo atualizado com sucesso:", vehicleResponse);
        return vehicleResponse;
      } else {
        throw new Error("Erro ao atualizar veículo no services.");
      }
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error.message);
      return null;
    }
  };
  
  export const handleVehicleDeletion = async (id) => {
    try {
      if (!id) {
        throw new Error("ID do veículo não fornecido.");
      }
  
      const success = await deleteVehicle(id);
  
      if (success) {
        console.log("Veículo excluído com sucesso.");
        return true;
      } else {
        throw new Error("Erro ao excluir veículo no services.");
      }
    } catch (error) {
      console.error("Erro ao excluir veículo: ", error.message);
      return false;
    }
  };
  