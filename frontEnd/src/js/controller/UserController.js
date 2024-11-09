import User from '../model/User';
import Address from '../model/Address.js';

document.getElementById('formUser').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const name = document.getElementById('name-user').value;
    const cpf = document.getElementById('cpf-user').value;
    const phone = document.getElementById('phone-user').value;
    const cep = document.getElementById('cep-user').value;
    const road = document.getElementById('road-user').value;
    const number = document.getElementById('number-user').value;
    const complement = document.getElementById('complement-user').value;
    const city = document.getElementById('city-user').value;
    const state = document.getElementById('state-user').value;
    const email = document.getElementById('email-user').value;
    const password = document.getElementById('password-user').value;

    try {
        // Valida o formulário
        if (validateForm(name, cpf, phone, cep, road, number, state, city, email, password)) {
            // Cria o endereço e o usuário
            const address = new Address(cep, road, number, complement, city, state);
            console.log(address.getAddress());

            const user = new User(name, cpf, phone, address, email, password);
            console.log(user);

            // Envia o usuário para o backend
            registerUser(user);
        }
    } catch (error) {
        console.log(error.message);
        return false;  // Impede a execução do código
    }
});

// Função de validação do formulário
export function validateForm(name, cpf, phone, cep, road, number, state, city, email, password) {
    // Valida se todos os campos obrigatórios estão preenchidos
    if (!name || !cpf || !phone || !cep || !road || !number || !state || !city || !email || !password) {
        alert('Todos os campos são obrigatórios.');
        return false; 
    }

    // Validação do CPF
    const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!regexCpf.test(cpf)) {
        alert('CPF inválido. O formato correto é XXX.XXX.XXX-XX.');
        return false;
    }

    // Validação do telefone
    const regexPhone = /\(\d{2}\) \d{5}-\d{4}/;
    if (!regexPhone.test(phone)) {
        alert('Telefone inválido. O formato correto é (XX) XXXXX-XXXX.');
        return false;
    }

    // Validação do CEP
    const regexCep = /\d{5}-\d{3}/;
    if (!regexCep.test(cep)) {
        alert('CEP inválido. O formato correto é XXXXX-XXX.');
        return false;
    }

    // Validação do e-mail (verificação simples)
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
        alert('E-mail inválido. Por favor, insira um e-mail válido.');
        return false;
    }

    // Validação da senha (mínimo de 6 caracteres)
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return false;
    }

    // Se todas as validações passarem, retorna true
    return true;
}

// Função para registrar o usuário no backend
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
        pageOpen();
    })
    .catch(error => {
        document.getElementById('resultado').innerHTML = 'Erro: ' + error.message;
    });
}

// Função para redirecionar para a página de dashboard
export function pageOpen() {
    window.location.href = '../pages/dashboard.html'; 
}
