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

exports.createUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, cpf, phone, email, password, address } = req.body;

    if (!name || !cpf || !phone || !email || !password || !address) {
      await t.rollback();
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: 'Usuário já registrado com este email.' });
    }

    const createdAddress = await Address.create(address, { transaction: t });

    const { salt, hashedPassword } = await hashPassword(password);

    const newUser = await User.create({
      name,
      cpf,
      phone,
      email,
      password: hashedPassword,
      salt,
      addressId: createdAddress.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(newUser);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
};


// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.body.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { password, ...updateData } = req.body;

    if (password) {
      const { salt, hashedPassword } = await hashPassword(password);
      updateData.password = hashedPassword;
      updateData.salt = salt;
    }

    await user.update(updateData);
    res.status(200).json(user);
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


