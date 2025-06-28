const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const ServiceProvider = require('../models/ServiceProvider');
const { getVehicleAll } = require('./vehicleController');
const { getAllServiceProviders} = require('./serviceProviderController');

const VALID_STATUS = ['aberto', 'parcelado', 'pago'];

const validateMaintenanceInput = (data) => {
  const requiredFields = ['vehicleId', 'serviceProviderId', 'type', 'date', 'price'];
  const missing = requiredFields.filter(field => !data[field]);

  if (missing.length) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
  }

  if (data.status && !VALID_STATUS.includes(data.status)) {
    throw new Error(`Status inválido. Permitidos: ${VALID_STATUS.join(', ')}`);
  }
};

exports.getMaintenances = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const maintenances = await Maintenance.findAll({ where: { userId } });

    if (!maintenances.length) {
      return res.status(200).json([]);
    }

    // Só busca dados relacionados se tiver manutenção
    const [vehiclesResponse, providersResponse] = await Promise.all([
      new Promise((resolve, reject) =>
        getVehicleAll(
          { query: { userId } },
          { status: () => ({ json: resolve, send: reject }) }
        )
      ),
      new Promise((resolve, reject) =>
       getAllServiceProviders(
          { query: { userId } },
          { status: () => ({ json: resolve, send: reject }) }
        )
      )
    ]);

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];
    const providers = Array.isArray(providersResponse) ? providersResponse : [];

    const detailed = maintenances.map(m => {
      const vehicle = vehicles.find(v => v.id === m.vehicleId);
      const provider = providers.find(p => p.id === m.serviceProviderId);
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


/** ---------------- GET by ID ---------------- */
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

/** ---------------- CREATE ---------------- */
exports.createMaintenance = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido na query.' });
    }

    const data = { ...req.body, userId };

    // Validação
    validateMaintenanceInput(data);

    const maintenance = await Maintenance.create(data);
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar manutenção.', details: error.message });
  }
};

/** ---------------- UPDATE ---------------- */
exports.updateMaintenance = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    const data = req.body;
    validateMaintenanceInput(data);

    await maintenance.update(data);
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar manutenção.', details: error.message });
  }
};

/** ---------------- PATCH Status ---------------- */
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    if (!status) return res.status(400).json({ error: 'Status não fornecido.' });
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: `Status inválido. Permitidos: ${VALID_STATUS.join(', ')}` });
    }

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    await maintenance.update({ status });
    res.status(200).json({ message: 'Status atualizado com sucesso.', maintenance });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar status.', details: error.message });
  }
};

/** ---------------- DELETE ---------------- */
exports.deleteMaintenance = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

    const maintenance = await Maintenance.findOne({ where: { id, userId } });
    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    await maintenance.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir manutenção.', details: error.message });
  }
};
