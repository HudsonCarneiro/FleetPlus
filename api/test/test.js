const bcrypt = require('bcrypt');

const testBcrypt = async () => {
    try {
        const password = 'nene'; // Substitua pela senha que deseja testar
        const saltRounds = 10;

        console.log('Senha original:', password);

        // Gerar o hash
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Hash gerado:', hash);

        // Comparar a senha com o hash
        const isMatch = await bcrypt.compare('nene', hash);
        console.log('Senhas coincidem?', isMatch);

        // Testar com uma senha incorreta
        const isMatchWrong = await bcrypt.compare('senhaIncorreta', hash);
        console.log('Senha incorreta coincide?', isMatchWrong);

    } catch (error) {
        console.error('Erro no teste do bcrypt:', error.message);
    }
};

// Executar o teste
testBcrypt(); 
