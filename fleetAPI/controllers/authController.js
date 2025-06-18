require('dotenv').config();
const User = require('../models/User');
const Address = require('../models/Address');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 's3cR3t@123456789!minha-chave-segura-para-jwt';
const JWT_EXPIRES_IN = '1h';

async function validatePassword(password, hashedPassword, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashedPassword;
}

const resetLoginAttempts = async (user) => {
  user.loginAttempts = 0;
  user.isBlocked = false;
  user.blockExpires = null;
  await user.save();
};

const handleFailedLogin = async (user) => {
  const MAX_ATTEMPTS = 3;
  const BLOCK_TIME_MINUTES = 5;

  user.loginAttempts += 1;

  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.isBlocked = true;
    user.blockExpires = new Date(Date.now() + BLOCK_TIME_MINUTES * 60 * 1000);
  }

  await user.save();
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    // Verifica se está bloqueado
    // Verifica se está bloqueado
    if (user.isBlocked && user.blockExpires > Date.now()) {
    const remainingMinutes = Math.ceil((user.blockExpires - Date.now()) / 60000);
    
    return res.status(403).json({
        success: false,
        message: `Conta temporariamente bloqueada. Tente novamente em ${remainingMinutes} minutos.`,
        remainingTime: remainingMinutes,
        isBlocked: true,
    });
    }

    // Se o bloqueio expirou, limpa os dados
    if (user.isBlocked && user.blockExpires <= Date.now()) {
      await resetLoginAttempts(user);
    }

    const isValid = await validatePassword(password, user.password, user.salt);
    if (!isValid) {
      await handleFailedLogin(user);

      const remainingAttempts = Math.max(0, 3 - user.loginAttempts);

      return res.status(401).json({
        success: false,
        message: remainingAttempts > 0
          ? `Senha incorreta. Você tem ${remainingAttempts} tentativa(s) restante(s).`
          : `Senha incorreta. Sua conta foi bloqueada por 5 minutos.`,
        isBlocked: user.isBlocked || false,
        remainingTime: user.isBlocked ? 5 : null,
      });
    }

    // Login bem-sucedido
    await resetLoginAttempts(user);

    const address = await Address.findOne({ where: { id: user.addressId } });

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      addressId: user.addressId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { password: _, salt: __, ...userData } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login bem-sucedido!',
      token,
      expiresIn: 3600,
      user: {
        ...userData,
        addressId: address ? address.id : null,
      },
    });

  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar login.',
      details: error.message,
    });
  }
};
