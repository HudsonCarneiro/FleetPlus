//falta arrumar 
import { 
    getAllVehicles, 
    getVehicleById, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle 
  } from '../services/VehicleServices.js';
  
  // Buscar todos os motoristas do usuário logado
  export const handleFetchAllVehicles = async () => {
    try {
      const vehicles = await getAllVehicles();
  
      if (!vehicles || vehicles.length === 0) {
        console.warn('Nenhum registro de veículo encontrado.');
        return [];
      }
  
      return vehicles;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error.message);
      return [];
    }
  };
  
  // Buscar um motorista pelo ID
  export const handleFetchVehicleById = async (id) => {
    try {
      const driver = await getDriverById(id);
  
      if (!driver) {
        throw new Error('Motorista não encontrado.');
      }
  
      return driver;
    } catch (error) {
      console.error('Erro ao buscar motorista:', error.message);
      return null;
    }
  };
  
  // Registrar um novo motorista
  export const handleVehicleRegistration = async (formData) => {
    try {
      // Verifica os campos obrigatórios
      if (!formData.name || !formData.cnh || !formData.phone) {
        throw new Error("Campos obrigatórios do motorista estão ausentes.");
      }
      if(formData.cnh.length != 11){
        throw new Error("Digite uma CNH válida!");
      }
  
      // Chama o service para criar o motorista
      const driverResponse = await createDriver(formData);
  
      if (driverResponse) {
        console.log('Motorista cadastrado com sucesso:', driverResponse);
        return driverResponse; // Retorna o motorista criado
      } else {
        throw new Error('Erro ao registrar motorista no services.');
      }
    } catch (error) {
      console.error('Erro no registro do motorista:', error.message);
      return null;
    }
  };
  
  // Atualizar motorista
  export const handleVehicleUpdate = async (formData) => {
    try {
      // Verifica os campos obrigatórios
      if (!formData.id || !formData.name || !formData.cnh || !formData.phone) {
        throw new Error("Campos obrigatórios do motorista estão ausentes.");
      }
  
      // Chama o service para atualizar o motorista
      const driverResponse = await updateDriver(formData.id, formData);
  
      if (driverResponse) {
        console.log("Motorista atualizado com sucesso:", driverResponse);
        return driverResponse; // Retorna o motorista atualizado
      } else {
        throw new Error("Erro ao atualizar motorista no services.");
      }
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error.message);
      return null;
    }
  };
  
  // Excluir motorista
  export const handleVehicleDeletion = async (id) => {
    try {
      if (!id) {
        throw new Error("ID do motorista não fornecido.");
      }
  
      const success = await deleteDriver(id);
  
      if (success) {
        console.log("Motorista excluído com sucesso.");
        return true;
      } else {
        throw new Error("Erro ao excluir motorista no services.");
      }
    } catch (error) {
      console.error("Erro ao excluir motorista:", error.message);
      return false;
    }
  };
  