const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.validateToken = (req, res) => {
    res.status(200).json({ message: 'Token válido.' });
};

// Registro do usuário
exports.register = async (req, res) => {
    try {
        const { name, cpf, phone, email, password, addressId } = req.body;

        // Valida se todos os campos obrigatórios foram preenchidos
        if (!name | !cpf | !phone || !email | !password | !addressId) {
            return res.status(400).json({ error: 'Nome, cpf, phone, email, senha e endereço são obrigatórios.' });
        }

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já registrado com este email.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário
        const newUser = await User.create({
            name,
            cpf,
            phone,
            email,
            password: hashedPassword,
            addressId
        });

        res.status(201).json(newUser);
        
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({
            error: 'Erro ao criar usuário',
            details: error.message,
        });
    }
};

// Login do usuário
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // Gera o token de autenticação
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

