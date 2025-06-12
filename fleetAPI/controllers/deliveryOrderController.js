const DeliveryOrder = require('../models/DeliveryOrder');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const { getClientAll } = require('./clientController');
const clientController = require('./clientController');



// Lista todas as ordens de entrega vinculadas ao usuário autenticado
exports.getDeliveryOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas as ordens de entrega do usuário
    const orders = await DeliveryOrder.findAll({
      where: { userId },
    });

    if (!orders.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    console.log('Ordens disponíveis:', orders);

    // Busca todos os clientes associados ao usuário
    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });

    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];
    console.log('Clientes disponíveis:', clients);

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];
    console.log('Motoristas disponíveis:', drivers);

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];
    console.log('Veículos disponíveis:', vehicles);

    // Mapeia os dados detalhados para cada ordem de entrega
    const ordersWithDetails = orders.map((order) => {
      console.log('Buscando cliente para pedido:', order.clientId);
      const client = clients.find((c) => Number(c.id) === Number(order.clientId)) || { businessName: 'Cliente não encontrado' };
      const driver = drivers.find((d) => Number(d.id) === Number(order.driverId)) || null;
      const vehicle = vehicles.find((v) => Number(v.id) === Number(order.vehicleId)) || null;

      return {
        ...order.toJSON(),
        Client: client
          ? { id: client.id, businessName: client.businessName }
          : null,
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              licensePlate: vehicle.plate || 'Placa não informada',
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

    // Busca a ordem de entrega pelo ID e pelo usuário
    const order = await DeliveryOrder.findOne({
      where: { id: req.params.id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Ordem de entrega não encontrada.' });
    }

    // Busca os clientes associados ao usuário
    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];

    // Busca os motoristas associados ao usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca os veículos associados ao usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Enriquecimento dos dados da ordem de entrega
    const client =
      clients.find((c) => Number(c.id) === Number(order.clientId)) || {
        businessName: 'Cliente não encontrado',
      };
    const driver =
      drivers.find((d) => Number(d.id) === Number(order.driverId)) || null;
    const vehicle =
      vehicles.find((v) => Number(v.id) === Number(order.vehicleId)) || null;

    const enrichedOrder = {
      ...order.toJSON(),
      Client: client
        ? { id: client.id, businessName: client.businessName }
        : null,
      Driver: driver ? { id: driver.id, name: driver.name } : null,
      Vehicle: vehicle
        ? {
            id: vehicle.id,
            model: vehicle.model,
            licensePlate: vehicle.plate || 'Placa não informada',
          }
        : null,
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
