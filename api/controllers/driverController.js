const Driver = require('../models/Driver'); // Corrigido para 'Driver', não 'User'

exports.getDriverAll = async (req, res) => {
    try {
        const drivers = await Driver.findAll(); // Corrigido de 'drvers' para 'drivers'
        res.status(200).json(drivers); // Retorna a lista correta de motoristas
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar motoristas',
            details: error.message // Detalhes do erro para depuração
        });
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (driver) {
            res.json(driver);
        } else {
            res.status(404).json({ error: 'Motorista não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar motorista',
            details: error.message // Detalhes do erro para depuração
        });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const newDriver = await Driver.create(req.body);
        res.status(201).json(newDriver); // Retorna o motorista criado com status 201
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar motorista',
            details: error.message // Detalhes do erro para depuração
        });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (driver) {
            await driver.update(req.body);
            res.json(driver); // Retorna o motorista atualizado
        } else {
            res.status(404).json({ error: 'Motorista não encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar motorista',
            details: error.message // Detalhes do erro para depuração
        });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (driver) {
            await Driver.destroy({
                where: { id: req.params.id }
            });
            res.status(204).send(); // Exclui com sucesso, sem conteúdo
        } else {
            res.status(404).json({ error: "Motorista não encontrado" }); // Retorna 404 se o motorista não for encontrado
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar motorista',
            details: error.message // Detalhes do erro para depuração
        });
    }
};
