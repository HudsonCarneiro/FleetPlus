import { validateUser } from '../services/authServices.js';
import { protectDashboard } from '../services/dashboardServices.js';
import { openDashboard } from '../services/dashboardServices.js';

document.getElementById('formLogin').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await validateUser(email, password);

        if (!response.success) {
            return alert(response.message || 'Login falhou. Verifique suas credenciais.');
        }

        localStorage.setItem('authToken', response.token);

        const userData = await protectDashboard(response.token); // Aguarda validação do token
        openDashboard(userData); // Redireciona ao dashboard com os dados do usuário
    } catch (error) {
        console.error('Erro durante o login:', error.message);
        alert('Erro ao validar login ou token. Tente novamente.');
    }
});