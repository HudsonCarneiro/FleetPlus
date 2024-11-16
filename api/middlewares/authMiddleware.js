const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pega o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido ou está ausente no cabeçalho de autorização.' });
    }

    // Verifica a validade do token usando a chave secreta armazenada em uma variável de ambiente
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        req.userId = decoded.userId; // Salva o ID do usuário para uso posterior
        next(); // Permite que o fluxo da requisição continue
    });
};
