// URL base da API
const API_URL = 'http://localhost:3000/api';

// Obtém o ID do usuário logado do localStorage
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Função genérica para requisições
const apiRequest = async (endpoint, method = 'GET', body = null, queryParams = {}) => {
  const userId = getUserIdFromSession();
  if (!userId) throw new Error('Usuário não autenticado.');

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('userId', userId); // Inclui o userId na query string

  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value); // Adiciona outros parâmetros
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    const bodyWithUserId = {
      ...body,
      userId: body.userId || userId, // Garante que o userId esteja presente no corpo
    };
    options.body = JSON.stringify(bodyWithUserId);
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => ({}));
    throw new Error(
      `Erro na requisição ${method} ${endpoint}: ${response.status} - ${errorDetails.message || response.statusText}`
    );
  }

  return method === 'DELETE' ? true : await response.json(); // DELETE não retorna corpo
};

// Função para listar todas as ordens de entrega
export const fetchDeliveryOrders = async () => {
  try {
    return await apiRequest('/deliveries'); // userId é automaticamente incluído via apiRequest
  } catch (error) {
    console.error('Erro ao buscar ordens de entrega:', error.message);
    throw error;
  }
};

// Função para buscar uma ordem de entrega pelo ID
export const fetchDeliveryOrderById = async (id) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');

    return await apiRequest(`/delivery/${id}`);
  } catch (error) {
    console.error('Erro ao buscar ordem de entrega:', error.message);
    throw error;
  }
};

// Função para criar uma nova ordem de entrega
export const registerDeliveryOrder = async (deliveryOrder) => {
  try {
    return await apiRequest('/delivery', 'POST', deliveryOrder);
  } catch (error) {
    console.error('Erro ao registrar ordem de entrega:', error.message);
    throw error;
  }
};

// Função para atualizar uma ordem de entrega
export const updateDeliveryOrder = async (id, updatedDeliveryOrder) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');

    return await apiRequest(`/delivery/${id}`, 'PUT', updatedDeliveryOrder);
  } catch (error) {
    console.error('Erro ao atualizar ordem de entrega:', error.message);
    throw error;
  }
};

// Função para atualizar apenas o status de uma ordem de entrega
export const updateDeliveryOrderStatus = async (id, status) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');

    return await apiRequest(`/delivery/${id}/status`, 'PATCH', { status });
  } catch (error) {
    console.error('Erro ao atualizar status da ordem de entrega:', error.message);
    throw error;
  }
};

// Função para excluir uma ordem de entrega
export const deleteDeliveryOrder = async (id) => {
  try {
    if (!id) throw new Error('ID da ordem de entrega não fornecido.');

    return await apiRequest(`/delivery/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir ordem de entrega:', error.message);
    throw error;
  }
};

// Função para exportar todas as ordens de entrega do usuário autenticado para um arquivo .txt
export const exportDeliveryOrdersToTxt = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/deliveries/export-txt?userId=${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro ao exportar ordens de entrega: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deliveries-${userId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar ordens de entrega:', error.message);
    throw error;
  }
};

// Função para listar todos os clientes
export const fetchClients = async () => {
  try {
    return await apiRequest('/clients/');
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};

// Função para listar todos os veículos
export const fetchVehicles = async () => {
  try {
    return await apiRequest('/vehicles/');
  } catch (error) {
    console.error('Erro ao buscar veículos:', error.message);
    throw error;
  }
};

// Função para listar todos os motoristas
export const fetchDrivers = async () => {
  try {
    return await apiRequest('/drivers/');
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error.message);
    throw error;
  }
};

// Exporta todas as funções juntas
export default {
  fetchDeliveryOrders,
  fetchDeliveryOrderById,
  registerDeliveryOrder,
  updateDeliveryOrder,
  updateDeliveryOrderStatus,
  deleteDeliveryOrder,
  exportDeliveryOrdersToTxt,
  fetchClients,
  fetchVehicles,
  fetchDrivers,
};
