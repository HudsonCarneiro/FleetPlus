import API_BASE_URL from '../constants/api';

// Helpers para sessão
export const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

export const getTokenFromSession = () => {
  return localStorage.getItem('token');
};

// Função genérica para requisições
const apiRequest = async (endpoint, method = 'GET', body = null, queryParams = {}) => {
  const userId = getUserIdFromSession();
  const token = getTokenFromSession();

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!token) throw new Error('Token de autenticação não encontrado.');

  const url = new URL(`${API_BASE_URL}${endpoint}`);
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
    options.body = JSON.stringify({
      ...body,
      userId: body.userId || userId,
    });
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

export default apiRequest;
