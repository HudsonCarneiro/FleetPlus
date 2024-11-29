export async function protectDashboard(token) {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
            method: 'GET', // Ajustado para GET, conforme o backend
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Lança um erro com base no status HTTP
            throw new Error('Token inválido ou expirado.');
        }

        const data = await response.json(); // Processa a resposta
        console.log('Token válido. Acesso permitido.', data);
        return data; // Retorna os dados do backend
    } catch (error) {
        console.error('Erro ao validar token:', error.message);
        // Limpa o token inválido e repassa a responsabilidade de redirecionamento
        localStorage.removeItem('token');
        throw error; // Repropaga o erro para ser tratado pelo componente que chamou
    }
}
