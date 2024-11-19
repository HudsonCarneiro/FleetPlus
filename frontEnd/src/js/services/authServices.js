export function validateUser(user, password) {
    fetch('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user, password)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json().token;
    })
}

export function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../pages/formLogin.html'; 
}
