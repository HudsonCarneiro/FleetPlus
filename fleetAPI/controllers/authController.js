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

const isUserBlocked = (user) => {
  return user.blockExpires && new Date(user.blockExpires) > new Date();
};

const getRemainingBlockTime = (user) => {
  return Math.ceil((new Date(user.blockExpires) - new Date()) / (1000 * 60));
};

const resetLoginAttempts = async (user) => {
  user.loginAttempts = 0;
  user.blockExpires = null;
  await user.save();
};

const handleFailedLogin = async (user) => {
  const MAX_ATTEMPTS = 3;
  const BLOCK_TIME_MINUTES = 5;
  
  user.loginAttempts += 1;
  
  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.blockExpires = new Date(Date.now() + BLOCK_TIME_MINUTES * 60000);
  }
  
  await user.save();
};

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

        if (user.isBlocked && user.blockExpiresAt > Date.now()) {
            const remainingMs = user.blockExpiresAt - Date.now();
            const remainingMinutes = Math.ceil(remainingMs / 60000);

            return res.status(403).json({
                success: false,
                message: `Sua conta foi bloqueada por ${remainingMinutes} minuto(s).`,
                remainingTime: remainingMinutes,
                isBlocked: true,
            });
            }

            // Se o bloqueio expirou, reseta
        if (user.isBlocked && user.blockExpiresAt <= Date.now()) {
            user.isBlocked = false;
            user.failedAttempts = 0;
            user.blockExpiresAt = null;
            await user.save();
            }

        // Validar a senha
        const isValid = await validatePassword(password, user.password, user.salt);
        if (!isValid) {
            await handleFailedLogin(user);
            
            const attemptsLeft = 3 - user.loginAttempts;
            return res.status(401).json({ 
                success: false, 
                message: `Senha incorreta. ${attemptsLeft > 0 ? `Você tem ${attemptsLeft} tentativa(s) restante(s).` : 'Sua conta foi bloqueada por 5 minutos.'}` 
            });
        }

        // Se chegou aqui, o login foi bem-sucedido
        await resetLoginAttempts(user);

        const address = await Address.findOne({ where: { id: user.addressId } });

        if (!address) {
            return res.status(500).json({ success: false, message: 'Endereço não encontrado.' });
        }

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
            expiresIn: JWT_EXPIRES_IN,
            user: {
                ...userData,
                addressId: address.id,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login.',
            details: error.message,
        });
    }
};
