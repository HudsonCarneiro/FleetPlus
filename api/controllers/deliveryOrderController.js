const DeliveryOrder = require('../models/DeliveryOrder');

// Lista todas as ordens de entrega
exports.getDeliveryOrderAll = async (req, res) => {
    try {
        const deliveries = await DeliveryOrder.findAll();
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar ordens de entrega',
            details: error.message
        });
    }
};

// Busca uma ordem de entrega por ID
exports.getDeliveryOrderById = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id);
        if (delivery) {
            res.status(200).json(delivery);
        } else {
            res.status(404).json({ error: 'Ordem de entrega não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar ordem de entrega',
            details: error.message
        });
    }
};

// Cria uma nova ordem de entrega
exports.createDeliveryOrder = async (req, res) => {
    try {
        const newDelivery = await DeliveryOrder.create(req.body);
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar ordem de entrega',
            details: error.message
        });
    }
};

// Atualiza uma ordem de entrega por ID
exports.updateDeliveryOrder = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id);
        if (delivery) {
            await delivery.update(req.body);
            res.status(200).json(delivery);
        } else {
            res.status(404).json({ error: 'Ordem de entrega não encontrada' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar ordem de entrega',
            details: error.message
        });
    }
};

// Deleta uma ordem de entrega por ID
exports.deleteDeliveryOrder = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id);
        if (delivery) {
            await DeliveryOrder.destroy({
                where: { id: req.params.id }
            });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Ordem de entrega não encontrada' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar ordem de entrega',
            details: error.message
        });
    }
};
