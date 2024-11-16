export function dashboardOpen() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Acesso negado. Você precisa estar logado para acessar esta página.');
        return;
    }

    window.location.href = '../pages/dashboard.html';
}

export function protectDashboard() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('Você precisa estar logado para acessar o dashboard.');
        
        window.location.href = '../pages/formLogin.html'; 
        return;
    }
   
    fetch('http://localhost:3000/api/validateToken', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return;
        } else {
            alert('Token inválido ou expirado. Faça login novamente.');
            window.location.href = '../pages/formLogin.html';
        }
    })
    .catch(error => {
        console.error('Erro ao validar token:', error);
        alert('Erro ao validar token. Faça login novamente.');
        window.location.href = '../pages/formLogin.html';
    });
}
