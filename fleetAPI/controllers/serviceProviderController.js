const ServiceProviderService = require('../services/ServiceProviderService.js');
const sequelize = require('../config/database.js');


// Criar prestador de serviço
exports.createServiceProvider = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const newServiceProvider = await ServiceProviderService.createServiceProvider(req.body, userId, t);
    await t.commit();
    res.status(201).json(newServiceProvider);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao criar prestador de serviço.', error: error.message });
  }
};

// Buscar todos os prestadores de serviço
exports.getAllServiceProviders = async (req, res) => {
  try {
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const { id } = req.params;
    const userId = req.user.id;
    const updated = await ServiceProviderService.updateServiceProvider(id, userId, req.body, t);
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
    const userId = req.user.id;
    await ServiceProviderService.deleteServiceProvider(id, userId, t);
    await t.commit();
    res.status(200).json({ message: 'Prestador de serviço excluído com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao excluir prestador de serviço.', error: error.message });
  }
};
