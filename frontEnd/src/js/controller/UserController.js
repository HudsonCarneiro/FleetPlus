import User from '../model/User';
import Address from '../model/Address.js';
import { validateUserData } from '../validators/userValidators.js';
import { registerUser } from '../view/userView.js';

document.getElementById('formUser').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário

    // Exibe o spinner de carregamento
    document.getElementById('loading').style.display = 'block';

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
        const validationErrors = validateUserData(name, cpf, phone, cep, road, number, state, city, email, password);

        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        // Valida o formulário
        if (validationErrors.length < 1) {
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
