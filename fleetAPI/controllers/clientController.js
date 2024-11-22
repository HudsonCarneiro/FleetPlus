const Client = require('../models/Client');

exports.getClientAll = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar clientes',
            details: error.message // Inclui detalhes do erro para depuração
        });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar cliente',
            details: error.message // Inclui detalhes do erro
        });
    }
};

exports.createClient = async (req, res) => {
    try {
        const newClient = await Client.create(req.body); // Corrigido de 'newUser' para 'newClient'
        res.status(201).json(newClient); // Retorna o cliente criado
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar um cliente',
            details: error.message // Inclui detalhes do erro
        });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (client) {
            await client.update(req.body);
            res.json(client); // Retorna o cliente atualizado
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar o cliente',
            details: error.message // Inclui detalhes do erro
        });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (client) {
            await Client.destroy({
                where: { id: req.params.id }
            });
            res.status(204).send(); // Exclusão bem-sucedida, sem conteúdo retornado
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' }); // Corrigido para '404' se o cliente não for encontrado
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar cliente',
            details: error.message // Inclui detalhes do erro
        });
    }
};
