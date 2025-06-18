import {
    fetchVehicles,
    fetchVehicleById,
    registerVehicle,
    updateVehicle,
    deleteVehicle,
    exportVehiclesReport,
  } from "../services/VehicleServices.js";
  
  // Função para validar campos obrigatórios
  const validateVehicleFields = (formData, fields) => {
    for (const field of fields) {
      if (!formData[field]) {
        throw new Error(`Campo obrigatório "${field}" ausente.`);
      }
    }
  };
  
  export const handleFetchAllVehicles = async () => {
    try {
      const vehicles = await fetchVehicles();
  
      if (!vehicles || vehicles.length === 0) {
        console.warn("Nenhum registro de veículo encontrado.");
        return [];
      }
  
      return vehicles;
    } catch (error) {
      console.error("Erro ao buscar veículos:", error.message);
      return [];
    }
  };
  
  export const handleFetchVehicleById = async (id) => {
    try {
      const vehicle = await fetchVehicleById(id);
  
      if (!vehicle) {
        throw new Error("Veículo não encontrado.");
      }
  
      return vehicle;
    } catch (error) {
      console.error("Erro ao buscar veículo:", error.message);
      return null;
    }
  };
  
  export const handleVehicleRegistration = async (formData) => {
    try {
      // Validação de campos obrigatórios
      validateVehicleFields(formData, ["plate", "model", "year"]);
  
      //Validação adicional para placa (padrão Mercosul)
      const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
      if (!plateRegex.test(formData.plate)) {
        window.alert("Digite uma PLACA válida no formato Mercosul (AAA0A00).");
        throw new Error("Digite uma PLACA válida no formato Mercosul (AAA0A00).");
      }
  
      const vehicleResponse = await registerVehicle(formData);
  
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
  export const handleExportVehiclesReport = async () => {
    try {
      await exportVehiclesReport();
      toast.success("Relatório de veículos gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório de veiculos:", error.message);
      toast.error("Erro ao gerar relatório de veículos.");
      throw error;
    }
  };
  