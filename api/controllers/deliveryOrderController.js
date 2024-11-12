const DeliveryOrder = require('../models/DeliveryOrder'); 


exports.getDeliveryAll = async (req, res) => {
    try {
        const deliveries  = await DeliveryOrder.findAll(); 
        res.status(200).json(deliveries); 
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar entregas',
            details: error.message
        });
    }
};

exports.getDeliveryOrderById = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id); 
        if (delivery) {
            res.json(delivery);
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


exports.updateDeliveryOrder = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id); 
        if (delivery) {
            await delivery.update(req.body);
            res.json(delivery);
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


exports.deleteDeliveryOrder = async (req, res) => {
    try {
        const delivery = await DeliveryOrder.findByPk(req.params.id); 
        if (delivery) {
            await DeliveryOrder.destroy({
                where: { id: req.params.id }
            });
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Ordem de entrega não encontrada" });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar ordem de entrega',
            details: error.message
        });
    }
};
