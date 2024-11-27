// Verifica se o token e o ID do usuário estão armazenados
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId; // Retorna true se ambos existirem
  };
  
  // Salva o token e o ID no localStorage
  export const saveAuthData = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };
  
  // Remove o token e o ID do localStorage
  export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };
  