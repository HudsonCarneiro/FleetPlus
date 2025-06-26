import Address from '../model/Address';
import User from '../model/User';
import userServices from '../services/userServices';
import AddressServices from '../services/AddressServices';
import { handleLogout } from './AuthController';
import Email from '../validators/email';
import Cpf from '../validators/cpf';
import Phone from '../validators/phone';
import Password from '../validators/password';
import { toast } from "react-toastify";


// Buscar usuário por ID e endereço associado
export const handleFetchUserById = async (id) => {
  try {
    const user = await userServices.fetchUserById(id);
    if (!user) throw new Error('Usuário não encontrado.');

    const address = await AddressServices.fetchAddressById(user.addressId);
    if (!address) throw new Error('Endereço não encontrado.');

    return {
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
  } catch (error) {
    console.error('Erro ao buscar usuário e endereço:', error);
    return null;
  }
};

export const handleUserRegistration = async (formData, navigate) => {
  try {
    // Validação dos dados
    const email = new Email(formData.email);
    const cpf = new Cpf(formData.cpf);
    const phone = new Phone(formData.phone);
    const password = new Password(formData.password); // validação de senha

    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state
    );

    const addressResponse = await AddressServices.registerAddress(address);
    if (!addressResponse) throw new Error('Erro ao registrar endereço.');

    const user = new User(
      formData.name,
      cpf.toString(),
      phone.toString(),
      email.toString(),
      password.toString()
    );

    const userResponse = await userServices.registerUser(user, addressResponse);
    if (userResponse) {
      console.log('Usuário cadastrado com sucesso');
      navigate('/login');
    } else {
      toast.info("Preencha corretamente os dados ");
      throw new Error('Erro ao registrar usuário.');
      
    }
  } catch (error) {
    console.error('Erro no registro do usuário:', error.message);
    return false;
  }
};


export const handleUserUpdate = async (formData) => {
  try {
    if (!formData.id || !formData.addressId)
      throw new Error("ID do usuário ou do endereço não fornecido.");

    // Validação dos dados
    const email = new Email(formData.email);
    const cpf = new Cpf(formData.cpf);
    const phone = new Phone(formData.phone);
    const password = new Password(formData.password); // validação de senha

    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state
    );

    const addressResponse = await AddressServices.updateAddress(formData.addressId, address);
    if (!addressResponse) throw new Error("Erro ao atualizar endereço.");

    const user = new User(
      formData.name,
      cpf.toString(),
      phone.toString(),
      email.toString(),
      password.toString()
    );

    const userResponse = await userServices.updateUser(formData.id, user);
    if (userResponse) {
      console.log("Usuário atualizado com sucesso:", userResponse);
      return true;
    } else {
      toast.info("Preencha corretamente os dados ");
      throw new Error("Erro ao atualizar usuário.");
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error.message);
    return false;
  }
};


// Excluir usuário
export const handleUserDeletion = async (userId, addressId, navigate) => {
  try {
    if (userId) await userServices.deleteUser(userId);
    if (addressId) await AddressServices.deleteAddress(addressId);

    console.log("Usuário e endereço excluídos com sucesso.");
    handleLogout(navigate);
    return true;
  } catch (error) {
    console.error("Erro ao excluir o usuário e endereço:", error);
    return false;
  }
};
