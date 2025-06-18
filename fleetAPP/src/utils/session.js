export const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

export const getTokenFromSession = () => {
  return localStorage.getItem('token');
};
