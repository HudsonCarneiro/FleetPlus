const Fueling = require('../models/Fueling'); 

// Lista todos os abastecimentos
exports.getFuelingAll = async (req, res) => {
    try {
        const supplies  = await Fueling.findAll(); 
        res.status(200).json(supplies); 
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar abastecimentos',
            details: error.message
        });
    }
};

// Busca um abastecimento por ID
exports.getFuelingById = async (req, res) => {
    try {
        const fueling = await Fueling.findByPk(req.params.id); 
        if (fueling) {
            res.json(fueling);
        } else {
            res.status(404).json({ error: 'Abastecimento não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar abastecimento',
            details: error.message
        });
    }
};

// Cria um novo abastecimento
exports.createFueling = async (req, res) => {
    try {
        const newFueling = await Fueling.create(req.body); 
        res.status(201).json(newFueling);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar abastecimento',
            details: error.message
        });
    }
};

// Atualiza um abastecimento por ID
exports.updateFueling = async (req, res) => {
    try {
        const fueling = await Fueling.findByPk(req.params.id); 
        if (fueling) {
            await fueling.update(req.body);
            res.json(fueling);
        } else {
            res.status(404).json({ error: 'Abastecimento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar abastecimento',
            details: error.message
        });
    }
};


exports.deleteFueling = async (req, res) => {
    try {
        const fueling = await Fueling.findByPk(req.params.id); 
        if (fueling) {
            await Fueling.destroy({
                where: { id: req.params.id }
            });
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Abastecimento não encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar abastecimento',
            details: error.message
        });
    }
};
