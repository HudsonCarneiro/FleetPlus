import { protectDashboard } from "../services/DashboardServices";

/**
 * Função para carregar os dados do dashboard.
 * 
 * @param {Function} setUserData - Função para atualizar o estado do usuário no componente.
 * @param {Function} setLoading - Função para atualizar o estado de carregamento no componente.
 * @param {Function} navigate - Função do React Router para redirecionamento.
 */
export const fetchDashboardData = async (setUserData, setLoading, navigate) => {
  try {
    // Obtém o token armazenado
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você não está autenticado. Redirecionando para o login.");
      navigate("/login");
      return;
    }

    // Faz a requisição para validar o token e obter os dados do usuário
    const data = await protectDashboard(token);

    // Atualiza os dados do usuário no estado do componente
    setUserData(data.user); // Supondo que a API retorne um objeto `user`
  } catch (error) {
    console.error("Erro ao carregar o dashboard:", error.message);
    navigate("/login"); // Redireciona para o login em caso de erro
  } finally {
    setLoading(false); // Finaliza o estado de carregamento
  }
};
