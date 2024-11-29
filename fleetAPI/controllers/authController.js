require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 's3cR3t@123456789!minha-chave-segura-para-jwt';
const JWT_EXPIRES_IN = '1h'; 

// Função para validar senha
async function validatePassword(password, hashedPassword, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashedPassword;
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
      }
  
      // Procurar o usuário pelo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
  
      // Validar a senha
      const isValid = await validatePassword(password, user.password, user.salt);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
  
      // Dados para incluir no token
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
  
      // Gerar o token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
      // Excluir informações sensíveis do usuário antes de retornar
      const { password: _, salt: __, ...userData } = user.toJSON();
  
      res.status(200).json({
        success: true,
        message: 'Login bem-sucedido!',
        token,
        expiresIn: JWT_EXPIRES_IN, // Tempo de expiração do token
        user: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao realizar login.',
        details: error.message,
      });
    }
  };
