import { validateUser } from '../services/authServices';

document.getElementById('formLogin').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão do formulário

    // Capturar os valores dos campos de entrada
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();

    // Validar os campos antes de enviar
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        // Chama a função do serviço para validar o usuário
        const response = await validateUser(email, password);

        if (response.success) {
            // Salvar o token no localStorage
            localStorage.setItem('authToken', response.token);

            // Redirecionar o usuário para o dashboard
            alert('Login bem-sucedido! Redirecionando para o dashboard...');
            window.location.href = '../pages/dashboard.html';
        } else {
            // Exibir mensagem de erro caso a resposta indique falha
            alert(response.message || 'Login falhou. Verifique suas credenciais.');
        }
    } catch (error) {
        // Lidar com erros inesperados na requisição
        console.error('Erro durante o login:', error);
        alert('Ocorreu um erro durante o login. Tente novamente.');
    }
});
