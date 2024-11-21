import User from '../model/User.js';
import Address from '../model/Address.js';
import { validateUserData } from '../validators/userValidators.js';
import { registerUser } from '../services/userServices.js';
import { registerAddress } from '../services/addressServices.js';

document.getElementById('formUser').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const name = document.getElementById('name-user').value;
    const cpf = document.getElementById('cpf-user').value.replace(/\D/g, "");
    const phone = document.getElementById('phone-user').value.replace(/\D/g, "");
    const cep = document.getElementById('cep-user').value;
    const road = document.getElementById('road-user').value;
    const number = document.getElementById('number-user').value;
    const complement = document.getElementById('complement-user').value;
    const city = document.getElementById('city-user').value;
    const state = document.getElementById('state-user').value;
    const email = document.getElementById('email-user').value;
    const password = document.getElementById('password-user').value;

    try {
        // Valida os dados do usuário
        const validationErrors = validateUserData(name, cpf, phone, cep, road, number, state, city, email, password);

        if (validationErrors.length > 0) {
            console.error('Validation Errors:', validationErrors);
            return false; // Interrompe o processo se houver erros
        }

        // Cria o objeto Address
        const address = new Address(cep, number, road, complement, city, state);

        // Registra o Address no banco de dados
        const addressId = await registerAddress(address);
        console.log('Endereço criado com sucesso. ID:', addressId);

        // Usa o addressId para criar o objeto User
        const user = new User(name, cpf, phone, email, password);
        console.log(user);
        // Depois registra o usuário com o ID do endereço
        const newUser = await registerUser(user ,addressId);

        console.log('Usuário criado com sucesso:', newUser);
        window.location.href = '../pages/formLogin.html';

        //document.getElementById('formUser').reset();
        
    } catch (error) {
        console.error('Erro no processo de criação:', error);
        return false; // Interrompe a execução em caso de erro
    }
});
