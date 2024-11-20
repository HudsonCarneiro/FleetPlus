const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { use } = require('../routes/userRoutes');

// Listar todos os usuários
exports.getUserAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar usuários',
            details: error.message,
        });
    }
};

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
};

// Criar novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, cpf, phone, email, password, addressId } = req.body;

        if (!name || !cpf || !phone || !email || !password || !addressId) {
            return res.status(400).json({ error: 'Nome, cpf, phone, email, senha e endereço são obrigatórios.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já registrado com este email.' });
        }

        // Gerando o salt com custo 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            cpf,
            phone,
            email,
            password: hashedPassword,
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
                // Gerando o salt com custo 10
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updateData.password = hashedPassword;
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
  
      // Encontrar o usuário pelo email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
  
      // Verifique se a senha criptografada está sendo recuperada corretamente
      console.log('Senha armazenada:', user.password);  // Para verificar a senha armazenada no banco
      console.log('Senha fornecida:', password);        // Para verificar a senha fornecida no login
  
      // Comparar a senha fornecida com a senha criptografada no banco
      const validation = await bcrypt.compare(password, user.password);
  
      console.log('Resultado da comparação de senha:', validation);  // Para verificar o resultado da comparação
  
      if (!validation) {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
  
      return res.status(200).json({ success: true, message: 'Login bem-sucedido!', user });
  
    } catch (error) {
      console.error('Erro ao realizar o login:', error);
      return res.status(500).json({ success: false, message: 'Ocorreu um erro. Tente novamente mais tarde.' });
    }
  };