export function protectDashboard() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Você precisa estar logado para acessar o dashboard.');
        window.location.href = '../pages/formLogin.html';
        return;
    }

    // Validar o token com uma requisição ao backend
    fetch('http://localhost:3000/api/validateToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Especifica que estamos enviando JSON
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Token válido. Acesso permitido.');
            return response.json(); // Opcional: Se precisar de dados adicionais do backend
        } else {
            throw new Error('Token inválido ou expirado.');
        }
    })
    .catch(error => {
        console.error('Erro ao validar token:', error.message);
        alert('Token inválido ou expirado. Faça login novamente.');
        window.location.href = '../pages/formLogin.html';
    });
}
