const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  try {
    // Verifica se o header Authorization está presente
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.warn('Tentativa de acesso sem token.');
      return res.status(401).json({ success: false, message: 'Token de autenticação não fornecido.' });
    }

    // Extrai o token do header
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.warn('Token não encontrado no header Authorization.');
      return res.status(401).json({ success: false, message: 'Token não encontrado.' });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário ao objeto da requisição

    console.info('Token válido. Acesso concedido ao usuário:', decoded.email);
    next(); // Permite que a requisição prossiga
  } catch (error) {
    console.error('Erro ao validar o token:', error.message);
    const errorMessage =
      error.name === 'TokenExpiredError'
        ? 'Token expirado. Faça login novamente.'
        : 'Token inválido.';
    res.status(403).json({ success: false, message: errorMessage });
  }
};
