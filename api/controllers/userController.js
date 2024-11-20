const User = require('../models/User');
const crypto = require('crypto');

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex'); // Gerar salt
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hashedPassword };
}
async function validatePassword(password, hashedPassword, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashedPassword;
}
  

exports.createUser = async (req, res) => {
    try {
      const { name, cpf, phone, email, password, addressId } = req.body;
  
      if (!name || !cpf || !phone || !email || !password || !addressId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já registrado com este email.' });
      }
  
      const { salt, hashedPassword } = await hashPassword(password);
  
      const newUser = await User.create({
        name,
        cpf,
        phone,
        email,
        password: hashedPassword,
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
  
//atualizar
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { password, ...updateData } = req.body;

            if (password) {
                // Gerar o hash da nova senha com PBKDF2
                const { salt, hashedPassword } = await hashPassword(password);
                updateData.password = hashedPassword;
                updateData.salt = salt; // Atualizar o salt também
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
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
  
      const isValid = await validatePassword(password, user.password, user.salt);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
  
      res.status(200).json({ success: true, message: 'Login bem-sucedido!', user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao realizar login.',
        details: error.message,
      });
    }
  };
  