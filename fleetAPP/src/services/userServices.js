import apiRequest from "../utils/ApiRequest";

// Criar usuário
export async function registerUser(user, addressId) {
  try {
    user.addressId = addressId;
    return await apiRequest("/user", "POST", user);
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error.message || error);
    throw error;
  }
}

// Buscar usuário por ID
export async function fetchUserById(id) {
  try {
    return await apiRequest(`/user/${id}`, "GET");
  } catch (error) {
    console.error("Erro ao buscar usuário:", error.message || error);
    throw error;
  }
}

// Buscar todos os usuários
export async function fetchUsers() {
  try {
    return await apiRequest("/user", "GET");
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.message || error);
    throw error;
  }
}

// Atualizar usuário
export async function updateUser(id, updatedUser) {
  try {
    return await apiRequest("/user", "PUT", updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error.message || error);
    throw error;
  }
}

// Excluir usuário
export async function deleteUser(id) {
  try {
    return await apiRequest("/user", "DELETE", { id });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message || error);
    throw error;
  }
}

// Exportar tudo
export default {
  registerUser,
  fetchUserById,
  fetchUsers,
  updateUser,
  deleteUser,
};
