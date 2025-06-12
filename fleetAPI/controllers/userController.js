const User = require('../models/User');
const crypto = require('crypto');


// Função para hash de senha
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex'); // Gera salt aleatório
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hashedPassword };
}
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'cpf', 'phone', 'email', 'addressId'], // Seleciona apenas os campos necessários
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar usuário',
      details: error.message,
    });
  }
};


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


