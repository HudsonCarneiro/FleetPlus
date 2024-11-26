import { saveAuthData } from '../utils/AuthUtils'; // Função para salvar os dados de autenticação

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      saveAuthData(data.token, data.userId); // Armazena o token e ID do usuário
      navigate('/dashboard'); // Redireciona para o dashboard
      return true; // Retorna true para indicar que o login foi bem-sucedido
    } else {
      alert('Erro ao autenticar. Verifique suas credenciais.');
      return false; // Retorna false se o login falhar
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao realizar login. Tente novamente mais tarde.');
    return false; // Retorna false em caso de erro
  }
};
