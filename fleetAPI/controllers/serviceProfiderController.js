const ServiceProviderService = require('../services/serviceProviderService.js');
const addressController = require('./addressController');
const sequelize = require('../config/database');

// Criar prestador de serviço
exports.createServiceProvider = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.'});
    }
    const newServiceProfider = await ServiceProviderService.createServiceProvider(req.body, userId, t);
    await t.commit();
    res.status(201).json(newServiceProfider);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao criar prestador de serviço.', error: error.message });
  }
};

// Buscar todos os prestadores de uma empresa
exports.getAllServiceProviders = async (req, res) => {
  try {
    const { userId } = req;

    if (!user) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const providers = await ServiceProviderService.getAllServiceProviders(userId);
    res.status(200).json(providers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao listar prestadores de serviço.', error: error.message });
  }
};

// Buscar prestador por ID
exports.getServiceProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      return res.status(403).json({ error: 'ID do usuário não fornecido.' });
    }

    const provider = await ServiceProviderService.getServiceProviderById(id, userId);

    res.status(200).json(provider);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: 'Erro ao obter prestador de serviço.', error: error.message });
  }
};

// Atualizar prestador de serviço
exports.updateServiceProvider = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req;
    const body = req.body;


    if (!userId) {
      return res.status(403).json({ error: 'ID do usuário não fornecido.' });
    }

    const updated = await ServiceProviderService.updateServiceProvider(id, userId, body, t);
    await t.commit();
    res.status(200).json(updated);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao atualizar prestador de serviço.', error: error.message });
  }
};

// Deletar prestador de serviço
exports.deleteServiceProvider = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      return res.status(403).json({ error: 'ID do usuário não fornecido.' });
    }

    await ServiceProviderService.deleteServiceProvider(id, userId, t);
    await t.commit();
    res.status(200).json({ message: 'Prestador de serviço excluído com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao excluir prestador de serviço.', error: error.message });
  }
};
