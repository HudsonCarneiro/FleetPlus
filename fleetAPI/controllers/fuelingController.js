const Fueling = require('../models/Fueling');

// Lista todos os abastecimentos vinculados ao usuário autenticado
exports.getFuelingAll = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const supplies = await Fueling.findAll({
            where: { userId },
        });

        res.status(200).json(supplies);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar abastecimentos',
            details: error.message,
        });
    }
};

// Busca um abastecimento por ID, garantindo que pertença ao usuário autenticado
exports.getFuelingById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const fueling = await Fueling.findOne({
            where: { id: req.params.id, userId },
        });

        if (fueling) {
            res.status(200).json(fueling);
        } else {
            res.status(404).json({ error: 'Abastecimento não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar abastecimento',
            details: error.message,
        });
    }
};

// Cria um novo abastecimento vinculado ao usuário autenticado
exports.createFueling = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const newFueling = await Fueling.create(req.body);
        res.status(201).json(newFueling);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar abastecimento',
            details: error.message,
        });
    }
};

// Atualiza um abastecimento, garantindo que pertença ao usuário autenticado
exports.updateFueling = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const fueling = await Fueling.findOne({
            where: { id: req.params.id, userId },
        });

        if (fueling) {
            await fueling.update(req.body);
            res.status(200).json(fueling);
        } else {
            res.status(404).json({ error: 'Abastecimento não encontrado ou não autorizado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar abastecimento',
            details: error.message,
        });
    }
};

// Deleta um abastecimento, garantindo que pertença ao usuário autenticado
exports.deleteFueling = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const fueling = await Fueling.findOne({
            where: { id: req.params.id, userId },
        });

        if (fueling) {
            await Fueling.destroy({
                where: { id: req.params.id, userId },
            });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Abastecimento não encontrado ou não autorizado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar abastecimento',
            details: error.message,
        });
    }
};
