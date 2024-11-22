const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Configuração do banco de dados (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Definição do modelo User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
});

// Sincronização com o banco de dados
(async () => {
    await sequelize.sync();
    console.log("Banco de dados sincronizado!");
})();

// Configuração do servidor Express
const app = express();
app.use(express.json());

// Rotas CRUD

// Criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const { nome, email } = req.body;
        const user = await User.create({ nome, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os usuários
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Buscar um usuário por ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

// Atualizar um usuário
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    const user = await User.findByPk(id);
    if (user) {
        user.nome = nome;
        user.email = email;
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

// Deletar um usuário
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
        await user.destroy();
        res.json({ message: 'Usuário deletado com sucesso' });
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
