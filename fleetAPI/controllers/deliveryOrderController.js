const DeliveryOrder = require('../models/DeliveryOrder');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const clientController = require('./clientController');
const driverController = require('./driverController');
const vehicleController = require('./vehicleController');
const fs = require('fs');
const path = require('path');

exports.exportDeliveriesToTxt = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas as ordens de entrega
    const deliveries = await DeliveryOrder.findAll({ where: { userId } });

    if (!deliveries.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    // Busca todos os clientes do usuário
    const clientsResponse = await new Promise((resolve, reject) => {
      clientController.getClientAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      driverController.getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      vehicleController.getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados de cliente, motorista e veículo às ordens de entrega
    const deliveriesWithDetails = deliveries.map((delivery) => {
      const client = clients.find((c) => c.id === delivery.clientId) || null;
      const driver = drivers.find((d) => d.id === delivery.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === delivery.vehicleId) || null;

      return {
        ...delivery.toJSON(),
        Client: client ? { id: client.id, businessName: client.businessName } : null,
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              licensePlate: vehicle.licensePlate,
            }
          : null,
      };
    });

    // Cria o conteúdo do relatório
    const reportLines = deliveriesWithDetails.map((delivery) => {
      return `Ordem ID: ${delivery.id}
Data de Entrega: ${
        delivery.deliveryDate
          ? new Date(delivery.deliveryDate).toLocaleDateString()
          : 'Não definida'
      }
Status: ${delivery.status}
Urgência: ${delivery.urgency}
Cliente: ${delivery.Client?.businessName || 'Desconhecido'}
Motorista: ${delivery.Driver?.name || 'Desconhecido'}
Veículo: ${
        delivery.Vehicle?.model || 'Desconhecido'
      } (${delivery.Vehicle?.licensePlate || 'Placa desconhecida'})
------------------------------------------------------------`;
    });

    const report = reportLines.join('\n\n');
    const filePath = path.join(__dirname, `delivery-report-${userId}.txt`);

    // Escreve o relatório no arquivo
    fs.writeFileSync(filePath, report);

    // Envia o arquivo para download
    res.download(filePath, `relatorio-entregas-${userId}.txt`, () => {
      fs.unlinkSync(filePath); // Remove o arquivo após o download
    });
  } catch (error) {
    console.error('Erro ao exportar ordens de entrega:', error.message);
    res.status(500).json({
      error: 'Erro ao exportar ordens de entrega.',
      details: error.message,
    });
  }
};


// Lista todas as ordens de entrega vinculadas ao usuário autenticado
exports.getDeliveryOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas as ordens do usuário
    const orders = await DeliveryOrder.findAll({
      where: { userId },
    });

    // Itera sobre as ordens para incluir os dados relacionados
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Simula o comportamento esperado por getClientById, etc.
        const client = await clientController.getClientbyId({
          params: { id: order.clientId },
          query: { userId },
        });

        const driver = await driverController.getDriverbyId({
          params: { id: order.driverId },
          query: { userId },
        });

        const vehicle = await vehicleController.getVehiclebyId({
          params: { id: order.vehicleId },
          query: { userId },
        });

        return {
          ...order.toJSON(),
          Client: client || { businessName: "Não disponível", companyName: "" },
          Driver: driver || { name: "Não disponível" },
          Vehicle: vehicle || { licensePlate: "Não disponível", model: "" },
        };
      })
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Erro ao listar ordens de entrega:", error.message);
    res.status(500).json({
      error: "Erro ao listar ordens de entrega.",
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
