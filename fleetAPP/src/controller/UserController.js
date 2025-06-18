import Address from '../model/Address';
import User from '../model/User';
import userServices from '../services/userServices';
import AddressServices from '../services/AddressServices';
import { handleLogout } from './AuthController';

// Buscar usuário por ID e endereço associado
export const handleFetchUserById = async (id) => {
  try {
    const user = await userServices.fetchUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Buscar o endereço associado ao usuário
    const address = await AddressServices.fetchAddressById(user.addressId);
    if (!address) {
      throw new Error('Endereço não encontrado.');
    }

    // Combinar os dados do usuário e endereço
    const userData = {
      name: user.name,
      cpf: user.cpf,
      phone: user.phone,
      email: user.email,
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    };

    return userData;
  } catch (error) {
    console.error('Erro ao buscar usuário e endereço:', error);
    return null;
  }
};

// Registrar usuário
export const handleUserRegistration = async (formData, navigate) => {
  try {
    // Extrai os dados de endereço
    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state,
    );

    const addressResponse = await AddressServices.registerAddress(address);

    if (!addressResponse) {
      throw new Error('Erro ao registrar endereço.');
    }

    const user = new User(
      formData.name,
      formData.cpf,
      formData.phone,
      formData.email,
      formData.password,
    );

    const userResponse = await userServices.registerUser(user, addressResponse);

    if (userResponse) {
      console.log('Usuário cadastrado com sucesso');
      navigate('/login'); // Redirecionando para a página de login
    } else {
      throw new Error('Erro ao registrar usuário.');
    }
  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    return false;
  }
};

// Atualizar usuário
export const handleUserUpdate = async (formData) => {
  try {
    // Validação básica dos dados recebidos
    if (!formData.id || !formData.addressId) {
      throw new Error("ID do usuário ou do endereço não fornecido.");
    }

    if (!formData.name || !formData.cpf || !formData.email) {
      throw new Error("Campos obrigatórios do usuário estão ausentes.");
    }

    if (!formData.cep || !formData.road || !formData.city || !formData.state) {
      throw new Error("Campos obrigatórios do endereço estão ausentes.");
    }
    

    // Criação da instância de endereço
    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state
    );

    // Atualização do endereço
    const addressResponse = await AddressServices.updateAddress(formData.addressId, address);

    if (!addressResponse) {
      throw new Error("Erro ao atualizar endereço no serviço.");
    }

    console.log("Endereço atualizado com sucesso:", addressResponse);

    // Criação da instância de usuário
    const user = new User(
      formData.name,
      formData.cpf,
      formData.phone,
      formData.email,
      formData.password
    );

    // Atualização do usuário
    const userResponse = await userServices.updateUser(formData.id, user);

    if (userResponse) {
      console.log("Usuário atualizado com sucesso:", userResponse);
      return true;
    } else {
      throw new Error("Erro ao atualizar usuário no serviço.");
    }
  } catch (error) {
    console.error("Não foi possível atualizar o usuário:", error.message);
    return false;
  }
};

// Excluir usuário
export const handleUserDeletion = async (userId, addressId, navigate) => {
  try {
    // Exclui o usuário
    if (userId) {
      await userServices.deleteUser(userId);
      console.log("Usuário excluído com sucesso.");
    }

    // Exclui o endereço associado
    if (addressId) {
      await AddressServices.deleteAddress(addressId);
      console.log("Endereço excluído com sucesso.");
    }

    // Após exclusão, realiza logout e redireciona
    handleLogout(navigate);

    return true; // Retorna true para indicar sucesso
  } catch (error) {
    console.error("Erro ao excluir o usuário e endereço:", error);
    return false; // Retorna false em caso de erro
  }
};


