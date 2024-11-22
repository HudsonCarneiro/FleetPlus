const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 's3cR3t@123456789!minha-chave-segura-para-jwt';
const JWT_EXPIRES_IN = '1h'; 

// Função para hash de senha
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex'); // Gera salt aleatório
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hashedPassword };
}

// Função para validar senha
async function validatePassword(password, hashedPassword, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashedPassword;
}

// Criar usuário
exports.createUser = async (req, res) => {
  try {
    const { name, cpf, phone, email, password, addressId } = req.body;

    if (!name || !cpf || !phone || !email || !password || !addressId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já registrado com este email.' });
    }

    // Gerar hash e salt para a senha
    const { salt, hashedPassword } = await hashPassword(password);

    const newUser = await User.create({
      name,
      cpf,
      phone,
      email,
      password: hashedPassword, // Salvar apenas o hash no banco de dados
      salt,
      addressId,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar usuário',
      details: error.message,
    });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { password, ...updateData } = req.body;

      if (password) {
        // Gerar novo hash e salt
        const { salt, hashedPassword } = await hashPassword(password);
        updateData.password = hashedPassword;
        updateData.salt = salt;
      }

      await user.update(updateData);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário', details: error.message });
  }
};

// Excluir usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
  }
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
      token, // Retornando o token gerado
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
