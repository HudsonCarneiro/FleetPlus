import User from '../model/User';
import UserServices from '../services/UserServices';

export const handleUserRegistration = async (formData, navigate) => {
  try {
    const user = new User(
      formData.name,
      formData.cpf,
      formData.phone,
      formData.cep,
      formData.number,
      formData.road,
      formData.city,
      formData.state,
      formData.email,
      formData.password,
      formData.status 
    );

    const userResponse = await UserServices.registerUser(user);

    if (userResponse) {
      console.log('Usuário cadastrado com sucesso');
      navigate('/login');  
    } else {
      throw new Error('Erro ao registrar usuário.');
    }
  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    return false;
  }
};
export const handleFetchUserById = async (id) => {
  try {
    const user = await UserServices.fetchUserById(id); 
    return user; 
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error.message || error);
    return null; 
  }
};
export const handleFetchUsers = async () => {
  try {
    const users = await UserServices.fetchUsers();
    return users; 
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};
export const handleUpdateUser = async (id, updatedUser) => {
  try {
    const userResponse = await UserServices.updateUser(id, updatedUser);
    if (userResponse) {
      console.log('Usuário atualizado com sucesso');
      return userResponse;
    } else {
      throw new Error('Erro ao atualizar o usuário.');
    }
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return false;
  }
};

export const handleDeleteUser = async (id) => {
  try {
    const deleteResponse = await UserServices.deleteUser(id);
    if (deleteResponse) {
      console.log('Usuário excluído com sucesso');
      return deleteResponse;
    } else {
      throw new Error('Erro ao excluir o usuário.');
    }
  } catch (error) {
    console.error('Erro ao excluir o usuário:', error);
    return false;
  }
};
