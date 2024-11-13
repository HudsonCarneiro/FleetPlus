export function registerUser(user) {
    fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        document.getElementById('loading').style.display = 'none';  // Oculta o carregamento após a resposta
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Erro na requisição'); });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('resultado').innerHTML = 'Usuário cadastrado com sucesso!';
        setTimeout(() => {
            pageOpen();  // Redireciona após 2 segundos
        }, 2000);
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';  // Oculta o carregamento após o erro
        document.getElementById('resultado').innerHTML = `Erro: ${error.message}`;
    });
}
// Função para redirecionar para a página de dashboard
export function pageOpen() {
    window.location.href = '../pages/dashboard.html'; 
}
