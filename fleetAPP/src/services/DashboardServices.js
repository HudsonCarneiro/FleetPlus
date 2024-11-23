export function protectDashboard(token) {
    return fetch('http://localhost:3000/api/validateToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async (response) => {
        if (response.ok) {
            const data = await response.json();
            console.log('Token válido. Acesso permitido.', data);
            return data; // Retorna os dados do backend
        } else {
            throw new Error('Token inválido ou expirado.');
        }
    })
    .catch(error => {
        console.error('Erro ao validar token:', error.message);
        alert('Token inválido ou expirado. Faça login novamente.');
        localStorage.removeItem('authToken'); // Limpa o token inválido
        window.location.href = '../pages/formLogin.html';
        throw error; // Repropaga o erro
    });
}
