import User from '../model/User.js';
import Address from '../model/Address.js';

document.getElementById('formLogin').addEventListener('submit', function(event){
    event.preventDefault();
    const user = document.getElementById(user).value;
    const password = document.getElementById(password).value;
    validateUser(user, password);
})

export function validateUser(user, password) {
    fetch('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
}