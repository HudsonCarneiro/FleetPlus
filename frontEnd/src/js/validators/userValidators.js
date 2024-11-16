// Função de validação do formulário
export function validateUserData(name, cpf, phone, cep, road, number, state, city, email, password) {
    let errors = [];

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!name || !cpf || !phone || !cep || !road || !number || !state || !city || !email || !password) {
        errors.push('Todos os campos obrigatórios devem ser preenchidos.');
    }
    // Validação do e-mail
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
        errors.push('E-mail inválido. Por favor, insira um e-mail válido.');
    }

    // Validação da senha (mínimo de 6 caracteres)
    if (password.length < 6) {
        errors.push('A senha deve ter pelo menos 6 caracteres.');
    }

    // Se houver erros, exibe todos de uma vez e retorna false
    if (errors.length > 0) {
        alert(errors.join('\n'));
    }

    // Se todas as validações passarem, retorna true
    return errors;
}
