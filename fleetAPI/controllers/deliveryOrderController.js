const DeliveryOrder = require('../models/DeliveryOrder');

// Lista todas as ordens de entrega do usuário autenticado
exports.getDeliveryOrderAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const deliveries = await DeliveryOrder.findAll({
      where: { userId },
    });

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar ordens de entrega',
      details: error.message,
    });
  }
};

// Busca uma ordem de entrega por ID, verificando se pertence ao usuário autenticado
exports.getDeliveryOrderById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const delivery = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (delivery) {
      res.status(200).json(delivery);
    } else {
      res.status(404).json({ error: 'Ordem de entrega não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar ordem de entrega',
      details: error.message,
    });
  }
};

// Cria uma nova ordem de entrega vinculada ao usuário autenticado
exports.createDeliveryOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const newDelivery = await DeliveryOrder.create(req.body);
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar ordem de entrega',
      details: error.message,
    });
  }
};

// Atualiza uma ordem de entrega, verificando se pertence ao usuário autenticado
exports.updateDeliveryOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const delivery = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (delivery) {
      await delivery.update(req.body);
      res.status(200).json(delivery);
    } else {
      res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar ordem de entrega',
      details: error.message,
    });
  }
};

// Deleta uma ordem de entrega, verificando se pertence ao usuário autenticado
exports.deleteDeliveryOrder = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const delivery = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (delivery) {
      await DeliveryOrder.destroy({
        where: { id: req.params.id, userId },
      });
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar ordem de entrega',
      details: error.message,
    });
  }
};
