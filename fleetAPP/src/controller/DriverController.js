import Driver from '../model/Driver.js';
import Name from '../validators/name';
import Phone from '../validators/phone';
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

export const handleDriverRegistration = async (formData) => {
  try {
    // Validações
    const name = new Name(formData.name);
    const phone = new Phone(formData.phone);

    const driver = new Driver(name.toString(), formData.cnh, phone.toString());

    const driverResponse = await registerDriver({
      name: driver.name,
      cnh: driver.cnh,
      phone: driver.phone
    });

    if (driverResponse) {
      console.log('Motorista cadastrado com sucesso:', driverResponse);
      return driverResponse;
    } else {
      throw new Error('Erro ao registrar motorista no services.');
    }
  } catch (error) {
    console.error('Erro no registro do motorista:', error.message);
    throw new Error(error.message || 'Falha ao registrar motorista.');
  }
};

// Atualizar motorista
export const handleDriverUpdate = async (formData) => {
  try {
    if (!formData.id) {
      throw new Error("ID do motorista ausente.");
    }

    // Validações
    const name = new Name(formData.name);
    const phone = new Phone(formData.phone);

    const driver = new Driver(name.toString(), formData.cnh, phone.toString());

    const driverResponse = await updateDriver(formData.id, {
      name: driver.name,
      cnh: driver.cnh,
      phone: driver.phone
    });

    if (driverResponse) {
      console.log("Motorista atualizado com sucesso:", driverResponse);
      return driverResponse;
    } else {
      throw new Error("Erro ao atualizar motorista no services.");
    }
  } catch (error) {
    console.error("Erro ao atualizar motorista:", error.message);
    throw new Error(error.message || 'Falha ao atualizar motorista.');
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
