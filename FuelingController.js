import {
    fetchFuelings,
    fetchFuelingById,
    registerFueling,
    updateFueling,
    deleteFueling,
    exportFuelingsToPDF,
    fetchDrivers,
    fetchVehicles,
  } from "../services/FuelingServices";
  import { toast } from "react-toastify";
  
  // Valida os dados de abastecimento antes do registro ou atualização
  const validateFuelingData = (data) => {
    const errors = [];
  
    if (!data.driverId) errors.push("Motorista é obrigatório.");
    if (!data.vehicleId) errors.push("Veículo é obrigatório.");
    if (!data.liters || data.liters <= 0) errors.push("Quantidade de litros deve ser positiva.");
    if (!data.price || data.price <= 0) errors.push("Preço deve ser positivo.");
    if (!data.mileage || data.mileage <= 0) errors.push("Quilometragem deve ser positiva.");
    if (!data.dateFueling) errors.push("Data do abastecimento é obrigatória.");
  
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  };
  
  // Buscar todos os abastecimentos
  export const handleFetchAllFuelings = async () => {
    try {
      const fuelings = await fetchFuelings();

      if (!Array.isArray(fuelings)) {
        throw new Error('Formato inesperado na resposta.');
      }
      console.log(fuelings);

      return fuelings.map((fueling) => ({
        id: fueling.id,
        driver: fueling.Driver?.name || 'Motorista não informado',
        vehicle:
          fueling.Vehicle?.licensePlate && fueling.Vehicle?.model
            ? `${fueling.Vehicle.model} (${fueling.Vehicle.licensePlate})`
            : "Desconhecido",
        liters: fueling.liters,
        price: fueling.price,
        mileage: fueling.mileage,
        dateFueling: fueling.dateFueling,
      }));
    } catch (error) {
      console.error("Erro ao buscar abastecimentos:", error.message);
      throw error;
    }
  };
  
  // Buscar um abastecimento por ID
  export const handleFetchFuelingById = async (id) => {
    try {
      if (!id) throw new Error("ID do abastecimento não fornecido.");
      return await fetchFuelingById(id);
    } catch (error) {
      console.error("Erro ao buscar abastecimento:", error.message);
      throw error;
    }
  };
  
  // Registrar novo abastecimento
  export const handleRegisterFueling = async (data) => {
    try {
      validateFuelingData(data);
      const response = await registerFueling(data);
      toast.success("Abastecimento registrado com sucesso!");
      return response;
    } catch (error) {
      console.error("Erro ao registrar abastecimento:", error.message);
      toast.error(`Erro ao registrar abastecimento: ${error.message}`);
      throw error;
    }
  };
  
  // Atualizar um abastecimento existente
  export const handleUpdateFueling = async (id, data) => {
    try {
      if (!id) throw new Error("ID do abastecimento é obrigatório.");
      validateFuelingData(data);
      const response = await updateFueling(id, data);
      toast.success("Abastecimento atualizado com sucesso!");
      return response;
    } catch (error) {
      console.error("Erro ao atualizar abastecimento:", error.message);
      throw error;
    }
  };
  
  // Excluir um abastecimento
  export const handleDeleteFueling = async (id) => {
    try {
      if (!id) throw new Error("ID do abastecimento é obrigatório.");
      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir este abastecimento?"
      );
      if (confirmDelete) {
        await deleteFueling(id);
        toast.success("Abastecimento excluído com sucesso!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao excluir abastecimento:", error.message);
      toast.error("Erro ao excluir abastecimento.");
      throw error;
    }
  };
  
  // Gerar relatório de abastecimentos em .txt
  export const handleExportFuelingReport = async () => {
    try {
      await exportFuelingsToPDF();
      toast.success("Relatório de abastecimentos gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório de abastecimentos:", error.message);
      toast.error("Erro ao gerar relatório de abastecimentos.");
      throw error;
    }
  };
  
  // Buscar lista de motoristas
  export const handleFetchDrivers = async () => {
    try {
      const drivers = await fetchDrivers();
      if (!drivers.length) {
        toast.info("Nenhum motorista encontrado.");
        return [];
      }
      return drivers.map((driver) => ({
        id: driver.id,
        name: driver.name,
      }));
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error.message);
      toast.error("Erro ao carregar lista de motoristas.");
      throw error;
    }
  };
  
  // Buscar lista de veículos
  export const handleFetchVehicles = async () => {
    try {
      const vehicles = await fetchVehicles();
      if (!vehicles.length) {
        toast.info("Nenhum veículo encontrado.");
        return [];
      }
      return vehicles.map((vehicle) => ({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        model: vehicle.model,
      }));
    } catch (error) {
      console.error("Erro ao buscar veículos:", error.message);
      toast.error("Erro ao carregar lista de veículos.");
      throw error;
    }
  };
  