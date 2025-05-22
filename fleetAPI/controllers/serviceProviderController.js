const ServiceProviderService = require('../services/serviceProviderService');
const addressController = require('./addressController');
const sequelize = require('../config/database');

// Criar prestador de serviço
exports.createServiceProvider = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user, body } = req;

    if (!user.companyId) {
      return res.status(403).json({ message: 'Usuário não associado a uma empresa.' });
    }

    const created = await ServiceProviderService.createServiceProvider(user.companyId, body, t);
    await t.commit();
    res.status(201).json(created);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao criar prestador de serviço.', error: error.message });
  }
};

// Buscar todos os prestadores de uma empresa
exports.getAllServiceProviders = async (req, res) => {
  try {
    const { user } = req;

    if (!user.companyId) {
      return res.status(403).json({ message: 'Usuário não associado a uma empresa.' });
    }

    const providers = await ServiceProviderService.getAllServiceProviders(user.companyId);
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
    const { user } = req;

    if (!user.companyId) {
      return res.status(403).json({ message: 'Usuário não associado a uma empresa.' });
    }

    const provider = await ServiceProviderService.getServiceProviderById(id, user.companyId);

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
    const { user, body } = req;

    if (!user.companyId) {
      return res.status(403).json({ message: 'Usuário não associado a uma empresa.' });
    }

    const updated = await ServiceProviderService.updateServiceProvider(id, user.companyId, body, t);
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
    const { user } = req;

    if (!user.companyId) {
      return res.status(403).json({ message: 'Usuário não associado a uma empresa.' });
    }

    await ServiceProviderService.deleteServiceProvider(id, user.companyId, t);
    await t.commit();
    res.status(200).json({ message: 'Prestador de serviço excluído com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(400).json({ message: 'Erro ao excluir prestador de serviço.', error: error.message });
  }
};
