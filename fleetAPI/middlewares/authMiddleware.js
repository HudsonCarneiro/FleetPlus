const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token inválido.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Inclui os dados do usuário autenticado na requisição
    next();
  } catch (error) {
    const errorMessage =
      error.name === 'TokenExpiredError'
        ? 'Token expirado. Faça login novamente.'
        : 'Token inválido.';
    res.status(403).json({ success: false, message: errorMessage });
  }
};
