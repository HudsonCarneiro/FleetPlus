export function dashboardOpen() {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Acesso negado. Você precisa estar logado para acessar esta página.');
        return;
    }

    // Redireciona para a página de dashboard
    window.location.href = '../pages/dashboard.html';
}
