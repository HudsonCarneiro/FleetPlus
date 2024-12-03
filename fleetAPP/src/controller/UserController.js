import Address from '../model/Address';
import User from '../model/User';
import UserServices from '../services/UserServices';
import AddressServices from '../services/AddressServices';
import { handleLogout } from './AuthController';

// Buscar usuário por ID
export const handleFetchUserById = async (id) => {
  try {
    const user = await UserServices.fetchUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user; // Retorna os dados do usuário
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null; // Retorna null em caso de erro
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

    const userResponse = await UserServices.registerUser(user, addressResponse);

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
export const handleUserUpdate = async (id, formData) => {
  try {
    // Extrai e organiza os dados de endereço
    const address = {
      cep: formData.cep,
      number: formData.number,
      road: formData.road,
      complement: formData.complement,
      city: formData.city,
      state: formData.state,
    };

    // Atualiza o endereço
    await AddressServices.updateAddress(formData.addressId, address);

    // Organiza os dados do usuário
    const updatedUser = {
      name: formData.name,
      cpf: formData.cpf,
      phone: formData.phone,
      email: formData.email,
      password: formData.password, // Enviar somente se for alterada
    };

    // Atualiza o usuário
    const userResponse = await UserServices.updateUser(id, updatedUser);

    if (!userResponse) {
      throw new Error('Erro ao atualizar o usuário.');
    }

    console.log('Usuário atualizado com sucesso:', userResponse);
    return userResponse; // Retorna o usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return null; // Retorna null em caso de erro
  }
};

// Excluir usuário
export const handleUserDeletion = async (userId, addressId, navigate) => {
  try {
    // Exclui o usuário
    if (addressId != null) {
      await UserServices.deleteUser(userId);
    }
    console.log(addressId);

    // Exclui o endereço associado
    await AddressServices.deleteAddress(addressId);

    console.log('Usuário e endereço excluídos com sucesso.');

    // Chama a função de logout e redireciona para o login
    handleLogout(navigate);
  } catch (error) {
    console.error('Erro ao excluir o usuário e endereço:', error);
    return false; // Retorna falso em caso de erro
  }
};

