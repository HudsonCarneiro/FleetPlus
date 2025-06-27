const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const ServiceProvider = require('../models/ServiceProvider');
const { getVehicleAll } = require('./vehicleController');
const { getServiceProviderAll } = require('./serviceProviderController');

// Lista todas as manutenções vinculadas ao usuário
exports.getMaintenances = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

    const maintenances = await Maintenance.findAll({ where: { userId } });
    if (!maintenances.length) return res.status(404).json({ error: 'Nenhuma manutenção encontrada.' });

    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll({ query: { userId } }, { status: code => ({ json: resolve, send: reject }) });
    });
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    const providersResponse = await new Promise((resolve, reject) => {
      getServiceProviderAll({ query: { userId } }, { status: code => ({ json: resolve, send: reject }) });
    });
    const providers = Array.isArray(providersResponse) ? providersResponse : [];

    const detailed = maintenances.map(m => {
      const vehicle = vehicles.find(v => v.id === m.vehicleId) || null;
      const provider = providers.find(p => p.id === m.serviceProviderId) || null;
      return {
        ...m.toJSON(),
        vehicle: vehicle ? { id: vehicle.id, model: vehicle.model } : null,
        provider: provider ? { id: provider.id, businessName: provider.businessName } : null,
      };
    });

    res.status(200).json(detailed);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar manutenções.', details: error.message });
  }
};

// Buscar manutenção por ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) return res.status(404).json({ error: 'Manutenção não encontrada.' });

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar manutenção.', details: error.message });
  }
};

// Criar manutenção
// Criar manutenção
exports.createMaintenance = async (req, res) => {
  try {
    const { userId } = req.query; 
    const { date, nfe, type, description, serviceProviderId, vehicleId, price, status } = req.body;

    if (!userId || !vehicleId || !serviceProviderId || !date || !type || !price) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
    }

    const maintenance = await Maintenance.create({
      userId,
      date,
      nfe,
      type,
      description,
      serviceProviderId,
      vehicleId,
      price,
      status
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar manutenção.', details: error.message });
  }
};


exports.updateMaintenance = async (req, res) => {
  try {
    const { userId } = req.query;       // agora pega da query
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    // Atualiza apenas os campos permitidos
    const {
      date,
      nfe,
      type,
      description,
      serviceProviderId,
      vehicleId,
      price,
      status
    } = req.body;

    await maintenance.update({
      date,
      nfe,
      type,
      description,
      serviceProviderId,
      vehicleId,
      price,
      status
    });

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar manutenção.', details: error.message });
  }
};

// Atualizar status da manutenção
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const { id } = req.params;
    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) return res.status(404).json({ error: 'Manutenção não encontrada.' });

    await maintenance.update({ status });
    res.status(200).json({ message: 'Status atualizado com sucesso.', maintenance });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status.', details: error.message });
  }
};

// Deletar manutenção
exports.deleteMaintenance = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) return res.status(404).json({ error: 'Manutenção não encontrada.' });

    await maintenance.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir manutenção.', details: error.message });
  }
};
