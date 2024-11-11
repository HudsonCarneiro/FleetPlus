const User = require('../models/User');
const bcrypt = require('bcrypt'); // Certifique-se de que o bcrypt está importado

// Listar todos os usuários
exports.getUserAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar usuários',
            details: error.message
        });
    }
};

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
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
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar usuário',
            details: error.message
        });
    }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.json(user);
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
            await User.destroy({ where: { id: req.params.id } });
            res.status(204).send(); // 204 significa que foi bem-sucedido, sem conteúdo
        } else {
            res.status(404).json({ error: "Usuário não encontrado" }); // Alterado para 404 em caso de não encontrado
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
};

// Login do usuário
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } }); // Corrigido de "were" para "where"

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Corrigido de "senha" para "password"

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        res.status(200).json({ message: 'Login concluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
    }
};
