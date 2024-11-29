export async function registerUser(user, addressId) {
    try {
      user.addressId = addressId;
  
      // Faz a requisição ao backend
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user), // Converte o objeto para JSON
      });
  
      if (!response.ok) {
        // Captura detalhes do erro retornado pelo backend
        const errorData = await response.json();
        throw new Error(
          `Erro ao criar o usuário: ${errorData.error || response.statusText}`
        );
      }
  
      // Retorna os dados do usuário criado
      const data = await response.json();
      return data;
    } catch (error) {
      // Exibe e propaga o erro
      console.error('Erro ao registrar o usuário:', error);
      throw error;
    }
  }
  export async function fetchUserById(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao buscar usuário: ${errorData.message || response.statusText}`
        );
      }
  
      const user = await response.json();
      return user; // Retorna os dados não sensíveis
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.message || error);
      throw error;
    }
  }
  
  
  
  export async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao buscar usuários: ${errorData.message || response.statusText}`
        );
      }
  
      const users = await response.json();
      return users; // Retorna a lista de usuários
    } catch (error) {
      console.error('Erro ao buscar usuários:', error.message || error);
      throw error;
    }
  }
  
  export async function updateUser(id, updatedUser) {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao atualizar usuário: ${errorData.message || response.statusText}`
        );
      }
  
      const user = await response.json(); // Retorna o usuário atualizado
      return user;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message || error);
      throw error;
    }
  }
  
  export async function deleteUser(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        return { message: 'Usuário excluído com sucesso' }; // Sucesso
      } else {
        const errorData = await response.json();
        throw new Error(
          `Erro ao excluir usuário: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.message || error);
      throw error; // Propaga o erro para o controlador
    }
  }
  
  
  // Exportando todas as funções juntas
  export default {
    registerUser,
    fetchUserById,
    fetchUsers,
    updateUser,
    deleteUser,
  };