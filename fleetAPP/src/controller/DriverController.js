import { 
  fetchDrivers, 
  fetchDriverById, 
  registerDriver, 
  updateDriver, 
  deleteDriver 
} from '../services/DriverServices.js';

// Buscar todos os motoristas do usuário logado
export const handleFetchAllDrivers = async () => {
  try {
    const drivers = await fetchDrivers();

    if (!drivers || drivers.length === 0) {
      console.warn('Nenhum registro de motorista encontrado.');
      return [];
    }

    return drivers;
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error.message);
    return [];
  }
};

// Buscar um motorista pelo ID
export const handleFetchDriverById = async (id) => {
  try {
    const driver = await fetchDriverById(id);

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
export const handleDriverRegistration = async (formData) => {
  try {
    // Verifica os campos obrigatórios
    if (!formData.name || !formData.cnh || !formData.phone) {
      throw new Error("Campos obrigatórios do motorista estão ausentes.");
    }
    if(formData.cnh.length != 11){
      throw new Error("Digite uma CNH válida!");
    }

    // Chama o service para criar o motorista
    const driverResponse = await registerDriver(formData);

    if (driverResponse) {
      console.log('Motorista cadastrado com sucesso:', driverResponse);
      return driverResponse; 
    } else {
      throw new Error('Erro ao registrar motorista no services.');
    }
  } catch (error) {
    console.error('Erro no registro do motorista:', error.message);
    return null;
  }
};

// Atualizar motorista
export const handleDriverUpdate = async (formData) => {
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
export const handleDriverDeletion = async (id) => {
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
