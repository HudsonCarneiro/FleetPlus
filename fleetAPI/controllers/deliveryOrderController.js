const DeliveryOrder = require('../models/DeliveryOrder');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const fs = require('fs');
const path = require('path');

exports.exportDeliveriesToTxt = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas as ordens de entrega do usuário
    const orders = await DeliveryOrder.findAll({
      where: { userId },
      include: [
        { model: Client, attributes: ['businessName'] },
        { model: Driver, attributes: ['name'] },
        { model: Vehicle, attributes: ['licensePlate', 'model'] },
      ],
    });

    if (!orders.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    // Formata os dados em texto
    const content = orders
      .map((order) => {
        return `
        Ordem ID: ${order.id}
        Data de Entrega: ${order.deliveryDate || 'Não definida'}
        Status: ${order.status}
        Urgência: ${order.urgency}
        Cliente: ${order.Client.businessName}
        Motorista: ${order.Driver.name}
        Veículo: ${order.Vehicle.model} - ${order.Vehicle.licensePlate}
        ------------------------------------------------------------
        `;
      })
      .join('\n');

    // Define o caminho do arquivo temporário
    const filePath = path.join(__dirname, `../../exports/deliveries-${userId}.txt`);

    // Salva o conteúdo no arquivo .txt
    fs.writeFileSync(filePath, content, 'utf-8');

    // Envia o arquivo como resposta para download
    res.download(filePath, `deliveries-${userId}.txt`, (err) => {
      if (err) {
        console.error('Erro ao enviar o arquivo:', err);
        return res.status(500).json({ error: 'Erro ao gerar o arquivo.' });
      }

      // Remove o arquivo temporário após o download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erro ao remover o arquivo temporário:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao exportar ordens de entrega:', error);
    res.status(500).json({ error: 'Erro ao exportar ordens de entrega.', details: error.message });
  }
};

// Lista todas as ordens de entrega vinculadas ao usuário autenticado
exports.getDeliveryOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const orders = await DeliveryOrder.findAll({
      where: { userId },
      include: [
        { model: Client, attributes: ['businessName', 'companyName'] },
        { model: Driver, attributes: ['name'] },
        { model: Vehicle, attributes: ['licensePlate', 'model'] },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar ordens de entrega.',
      details: error.message,
    });
  }
};

// Busca uma ordem de entrega por ID
exports.getDeliveryOrderById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
      include: [
        { model: Client, attributes: ['businessName', 'companyName'] },
        { model: Driver, attributes: ['name'] },
        { model: Vehicle, attributes: ['licensePlate', 'model'] },
      ],
    });

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Ordem de entrega não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar ordem de entrega.',
      details: error.message,
    });
  }
};

// Cria uma nova ordem de entrega
exports.createDeliveryOrder = async (req, res) => {
  try {
    const { userId, clientId, driverId, vehicleId, deliveryDate, status, urgency } = req.body;

    if (!userId || !clientId || !driverId || !vehicleId) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos.' });
    }

    const newOrder = await DeliveryOrder.create({
      userId,
      clientId,
      driverId,
      vehicleId,
      deliveryDate,
      status,
      urgency,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar ordem de entrega.',
      details: error.message,
    });
  }
};

// Atualiza uma ordem de entrega existente
exports.updateDeliveryOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }

    await order.update(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar ordem de entrega.',
      details: error.message,
    });
  }
};
// Atualiza apenas o status de uma ordem de entrega
exports.updateDeliveryOrderStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    if (!['aguardando', 'enviado', 'finalizado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }

    // Atualiza apenas o status da ordem
    await order.update({ status });
    res.status(200).json({ message: 'Status atualizado com sucesso.', order });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar o status da ordem de entrega.',
      details: error.message,
    });
  }
};

// Exclui uma ordem de entrega
exports.deleteDeliveryOrder = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }

    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao excluir ordem de entrega.',
      details: error.message,
    });
  }
};
