const API_URL = 'http://localhost:3333/api';

const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

const getTokenFromSession = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint, method = 'GET', body = null, queryParams = {}) => {
  const userId = getUserIdFromSession();
  const token = getTokenFromSession();

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!token) throw new Error('Token de autenticação não encontrado.');

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('userId', userId);

  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value);
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    const bodyWithUserId = {
      ...body,
      userId: body.userId || userId,
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

  return method === 'DELETE' ? true : await response.json();
};

// Buscar a empresa vinculada ao usuário logado
export const fetchCompanyByUser = async () => {
  try {
    return await apiRequest('/company/user');
  } catch (error) {
    console.error('Erro ao buscar empresa:', error.message);
    throw error;
  }
};

// Criar uma nova empresa e vincular o usuário logado
export const registerCompany = async (companyData) => {
  try {
    return await apiRequest('/company', 'POST', companyData);
  } catch (error) {
    console.error('Erro ao registrar empresa:', error.message);
    throw error;
  }
};

// Atualizar empresa existente
export const updateCompany = async (companyId, updatedData) => {
  try {
    if (!companyId) throw new Error('ID da empresa não fornecido.');
    return await apiRequest(`/company/${companyId}`, 'PUT', updatedData);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error.message);
    throw error;
  }
};

// Excluir empresa
export const deleteCompany = async (companyId) => {
  try {
    if (!companyId) throw new Error('ID da empresa não fornecido.');
    return await apiRequest(`/company/${companyId}`, 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir empresa:', error.message);
    throw error;
  }
};

// Exportação única
export default {
  fetchCompanyByUser,
  registerCompany,
  updateCompany,
  deleteCompany,
};
