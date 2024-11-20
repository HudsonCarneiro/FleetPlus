const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 's3cR3t@123456789!minha-chave-segura-para-jwt';

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do header Authorization

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verifica e decodifica o token
    req.user = decoded; // Adiciona os dados do usuário no request
    next(); // Permite que a requisição prossiga
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};

  