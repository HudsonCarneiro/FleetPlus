const API_URL = "http://localhost:3000/api";

// Centraliza a lógica para obter o ID do usuário autenticado
const getUserIdFromSession = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).id : null;
};
const getTokenFromSession = () => {
  return localStorage.getItem('token');
};


// Função para buscar todos os veículos vinculados ao usuário logado
export const getAllVehicles = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/vehicles?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao obter veículos: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter veículos:", error.message);
    throw error;
  }
};

// Função para buscar um veículo específico pelo ID
export const getVehicleById = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/vehicle/${id}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao obter veículo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter veículo:", error.message);
    throw error;
  }
};

// Função para criar um novo veículo
export const createVehicle = async (vehicleData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/vehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...vehicleData, userId }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao criar veículo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar veículo: ", error.message);
    throw error;
  }
};

// Função para atualizar um veículo existente
export const updateVehicle = async (id, vehicleData) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/vehicle/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...vehicleData, userId }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar veículo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error.message);
    throw error;
  }
};

// Função para excluir um veículo
export const deleteVehicle = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/vehicle/${id}?userId=${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir veículo: ${response.statusText}`);
    }
    return response.ok; // Retorna true se a exclusão foi bem-sucedida
  } catch (error) {
    console.error("Erro ao excluir veículo:", error.message);
    throw error;
  }
};
export const exportVehiclesReport = async () => {
  try {
    const userId = getUserIdFromSession();
    const token = getTokenFromSession(); // Obtém o token aqui
    if (!userId) throw new Error('Usuário não autenticado.');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await fetch(`${API_URL}/vehicles/report?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(
        `Erro ao exportar ordens de entrega: ${errorDetails.message || response.statusText}`
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicles-${userId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar veiculos:', error.message);
    throw error;
  }
};
