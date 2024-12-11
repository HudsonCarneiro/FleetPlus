// URL base da API
const API_URL = 'http://localhost:3000/api';

// Obtém o ID do usuário logado do localStorage
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Obtém o token do usuário logado do localStorage
const getTokenFromSession = () => {
  return localStorage.getItem('token');
};

// Função genérica para requisições
const apiRequest = async (endpoint, method = 'GET', body = null, queryParams = {}) => {
  const userId = getUserIdFromSession();
  const token = getTokenFromSession();

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!token) throw new Error('Token de autenticação não encontrado.');

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('userId', userId); // Inclui o userId na query string

  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value); // Adiciona outros parâmetros
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
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

// Função para buscar todos os clientes do usuário logado
export const fetchClients = async () => {
  try {
    const response = await apiRequest('/clients/');
    console.log('clients: ', response);
    return response || []; // Extrai o array "clients" ou retorna um array vazio caso não exista
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};


// Função para buscar um cliente pelo ID
export const fetchClientById = async (id) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');

    return await apiRequest(`/client/${id}`);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message);
    throw error;
  }
};

// Função para registrar um cliente com endereço
export const registerClient = async (client) => {
  try {
    return await apiRequest('/client', 'POST', client);
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    throw error;
  }
};

// Função para atualizar um cliente e endereço
export const updateClient = async (id, updatedClient) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');
    if (!updatedClient || typeof updatedClient !== 'object') {
      throw new Error('Dados do cliente inválidos ou não fornecidos.');
    }

    return await apiRequest(`/client/${id}`, 'PUT', updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw error;
  }
};

// Função para excluir um cliente
export const deleteClient = async (id) => {
  try {
    if (!id) throw new Error('ID do cliente não fornecido.');

    return await apiRequest(`/client/${id}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    throw error;
  }
};

// Exporta todas as funções juntas
export default {
  registerClient,
  fetchClients,
  fetchClientById,
  updateClient,
  deleteClient,
};
