const DeliveryOrder = require('../models/DeliveryOrder');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const clientController = require('./clientController');
const driverController = require('./driverController');
const vehicleController = require('./vehicleController');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.exportDeliveriesReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todos os abastecimentos
    const deliveries = await DeliveryOrder.findAll({ where: { userId } });

    if (!deliveries.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados de motorista e veículo aos abastecimentos
    const deliveriesWithDetails = deliveries.map((delivery) => {
      const driver = drivers.find((d) => d.id === delivery.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === delivery.vehicleId) || null;

      return {
        ...delivery.toJSON(),
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              plate: vehicle.plate,
              mileage: vehicle.mileage,
            }
          : null,
      };
    });

    // Cria o PDF
    const filePath = path.join(__dirname, `delivery-report-${userId}.pdf`);
    const doc = new PDFDocument();

    // Escreve o cabeçalho do relatório
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Relatório de Ordens de Entrega', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(12).text(`Usuário ID: ${userId}`, { align: 'center' });
    doc.moveDown(2);

    deliveriesWithDetails.forEach((supply, index) => {
      doc.fontSize(14).text(`Entrega #${index + 1}`, { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`Data: ${supply.deliveryDate}`);
      doc.text(`Status: ${supply.status}`);
      doc.text(`Urgência: ${supply.urgency}`);
      doc.text(`Motorista: ${supply.Driver?.name || 'Desconhecido'}`);
      doc.text(`Veículo: ${supply.Vehicle?.model || 'Desconhecido'}`);
      doc.text(`Placa: ${supply.Vehicle?.plate || 'N/A'}`);

      doc.moveDown(1);
      doc.text('------------------------------------------------------------');
      doc.moveDown(1);
    });

    doc.end();

    // Envia o PDF para download
    res.download(filePath, `relatorio-ordensDeEntrega-${userId}.pdf`, () => {
      fs.unlinkSync(filePath); // Remove o arquivo após o download
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de entregas:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de entregas.',
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

    if (!orders.length) {
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
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados aos pedidos
    const ordersWithDetails = orders.map((order) => {
      const client = clients.find((c) => c.id === order.clientId) || null;
      const driver = drivers.find((d) => d.id === order.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === order.vehicleId) || null;

      return {
        ...order.toJSON(),
        Client: client ? { id: client.id, businessName: client.businessName } : null,
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              licensePlate: vehicle.plate, // Use o atributo correto
            }
          : null,
      };
    });

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error('Erro ao listar ordens de entrega:', error.message);
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
        { model: Vehicle, attributes: ['plate', 'model'] },
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
