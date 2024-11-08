import User from '../model/User.js';
import Address from '../model/Address.js';

document.getElementById('formUser').addEventListener('submit', function(event){
    event.preventDefault();
    const address = new Address(
        document.getElementById("cep-user").value,
        document.getElementById("road-user").value,
        document.getElementById("number-user").value,
        document.getElementById("complement-user").value,
        document.getElementById("city-user").value,
        document.getElementById("state-user").value
    )
    console.log(address.getAddress());

    const user = new User(
        document.getElementById("name-user").value,
        document.getElementById("cpf-user").value,
        document.getElementById("phone-user").value,
        address,
        document.getElementById("email-user").value,
        document.getElementById("password-user").value
    )
    console.log(user);  
    registerUser(user);
})

export function registerUser(user) {
    fetch('http://localhost:3000/api/user', {
        method: 'POST',
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
    .then(data => {
        document.getElementById('resultado').innerHTML = 'Usuário cadastrado com sucesso!';
    })
    .catch(error => {
        document.getElementById('resultado').innerHTML = 'Erro: ' + error.message;
    });
}