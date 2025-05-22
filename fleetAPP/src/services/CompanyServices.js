const API_URL = 'http://localhost:3333/api';

// Obtém o ID do usuário logado do localStorage
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Obtém o token do usuário logado do localStorage
const getTokenFromSession = () => {
  return localStorage.getItem('token');
};


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
