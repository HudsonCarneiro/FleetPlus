const DeliveryOrder = require('../models/DeliveryOrder');
const Company = require('../models/Company');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const { getClientAll } = require('./clientController');

// Lista todas as ordens de entrega vinculadas à empresa
exports.getDeliveryOrders = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ error: 'ID da empresa não fornecido.' });
    }

    const orders = await DeliveryOrder.findAll({
      where: { companyId },
    });

    if (!orders.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];
    const drivers = Array.isArray(driversResponse) ? driversResponse : [];
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    const ordersWithDetails = orders.map((order) => {
      const client = clients.find((c) => Number(c.id) === Number(order.clientId)) || { businessName: 'Cliente não encontrado' };
      const driver = drivers.find((d) => Number(d.id) === Number(order.driverId)) || null;
      const vehicle = vehicles.find((v) => Number(v.id) === Number(order.vehicleId)) || null;

      return {
        ...order.toJSON(),
        Client: client ? { id: client.id, businessName: client.businessName } : null,
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle ? { id: vehicle.id, model: vehicle.model, licensePlate: vehicle.plate || 'Placa não informada' } : null,
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
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ error: 'ID da empresa não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, companyId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada.' });
    }

    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { companyId } },
        { status: () => ({ json: resolve, send: reject }) }
      );
    });

    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];
    const drivers = Array.isArray(driversResponse) ? driversResponse : [];
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    const client = clients.find((c) => Number(c.id) === Number(order.clientId)) || { businessName: 'Cliente não encontrado' };
    const driver = drivers.find((d) => Number(d.id) === Number(order.driverId)) || null;
    const vehicle = vehicles.find((v) => Number(v.id) === Number(order.vehicleId)) || null;

    const enrichedOrder = {
      ...order.toJSON(),
      Client: client ? { id: client.id, businessName: client.businessName } : null,
      Driver: driver ? { id: driver.id, name: driver.name } : null,
      Vehicle: vehicle ? { id: vehicle.id, model: vehicle.model, licensePlate: vehicle.plate || 'Placa não informada' } : null,
    };

    res.status(200).json(enrichedOrder);
  } catch (error) {
    console.error('Erro ao buscar ordem de entrega por ID:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar ordem de entrega.',
      details: error.message,
    });
  }
};

// Cria uma nova ordem de entrega
exports.createDeliveryOrder = async (req, res) => {
  try {
    const { companyId, clientId, driverId, vehicleId, deliveryDate, status, urgency } = req.body;

    if (!companyId || !clientId || !driverId || !vehicleId) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos.' });
    }

    const newOrder = await DeliveryOrder.create({
      companyId,
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
    const { companyId } = req.body;
    if (!companyId) {
      return res.status(400).json({ error: 'ID da empresa não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, companyId },
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
    const { companyId, status } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'ID da empresa não fornecido.' });
    }

    if (!['aguardando', 'enviado', 'finalizado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, companyId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada ou não autorizada.' });
    }

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
    const { companyId } = req.query;
    if (!companyId) {
      return res.status(400).json({ error: 'ID da empresa não fornecido.' });
    }

    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, companyId },
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
