const User = require('../models/User');
const bcrypt = require('bcrypt');

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
        const { name, cpf, phone, email,  password, addressId } = req.body;

        if (!name || !cpf | !phone | !email || !password, !addressId) {
            return res.status(400).json({ error: 'Nome, cpf, phone, email, senha e endereço são obrigatórios.' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já registrado com este email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashedPassword });

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
            await user.update(req.body);
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

// Login do usuário
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        // Retorne informações adicionais, como token JWT, se necessário
        res.status(200).json({ message: 'Login bem-sucedido.', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.', details: error.message });
    }
};
