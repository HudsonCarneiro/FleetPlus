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

// Função para listar todos os abastecimentos
export const fetchFuelings = async () => {
  try {
    const fuelingResponse = await apiRequest('/fuelings');

    // Verifica se o retorno é um array vazio
    if (Array.isArray(fuelingResponse) && fuelingResponse.length === 0) {
      console.log("Nenhum abastecimento cadastrado");
      return []; // Retorna um array vazio para consistência
    }

    return fuelingResponse;
  } catch (error) {
    console.error('Erro ao buscar abastecimentos:', error.message);
    throw error; // Lança o erro para ser tratado em outro lugar
  }
};

// Função para buscar um abastecimento pelo ID
export const fetchFuelingById = async (id) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    const response = await apiRequest(`/fueling/${id}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar abastecimento:', error.message);
    throw error;
  }
};

// Função para registrar um abastecimento
export const registerFueling = async (fuelingData) => {
  try {
    return await apiRequest('/fueling', 'POST', fuelingData);
  } catch (error) {
    console.error('Erro ao registrar abastecimento:', error.message);
    throw error;
  }
};

// Função para atualizar um abastecimento
export const updateFueling = async (id, updatedFueling) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    return await apiRequest(`/fueling/${id}`, 'PUT', updatedFueling);
  } catch (error) {
    console.error('Erro ao atualizar abastecimento:', error.message);
    throw error;
  }
};

// Função para excluir um abastecimento
export const deleteFueling = async (id) => {
  try {
    if (!id) throw new Error('ID do abastecimento não fornecido.');
    return await apiRequest(`/fueling/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir abastecimento:', error.message);
    throw error;
  }
};

// Função para buscar todos os motoristas
export const fetchDrivers = async () => {
  try {
    return await apiRequest('/drivers');
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error.message);
    throw error;
  }
};

// Função para buscar todos os veículos
export const fetchVehicles = async () => {
  try {
    return await apiRequest('/vehicles');
  } catch (error) {
    console.error('Erro ao buscar veículos:', error.message);
    throw error;
  }
};

export const exportFuelingsToPDF = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error("Usuário não autenticado.");

    const response = await fetch(`${API_URL}/fuelings/report?userId=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao exportar relatório de abastecimentos: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fueling-report-${userId}.pdf`; // Corrigido para PDF
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao exportar relatório de abastecimentos:", error);
    throw error;
  }
};


// Exporta todas as funções juntas
export default {
  fetchFuelings,
  fetchFuelingById,
  registerFueling,
  updateFueling,
  deleteFueling,
  exportFuelingsToPDF,
  fetchDrivers,
  fetchVehicles,
};
