const ServiceProvider = require('../models/ServiceProvider');
const sequelize = require('../config/database');

const Phone = require('../validators/Phone');
const Cnpj = require('../validators/CNPJ');

async function getAllByCompany(companyId) {
  if (!companyId) throw new Error('Usuário não associado a uma empresa.');

  const providers = await ServiceProvider.findAll({ where: { companyId } });
  return providers;
}

async function getById(id, companyId) {
  if (!companyId) throw new Error('Usuário não associado a uma empresa.');

  const provider = await ServiceProvider.findOne({ where: { id, companyId } });
  if (!provider) throw new Error('Fornecedor não encontrado.');

  return provider;
}

async function createServiceProvider(data, companyId) {
  if (!companyId) throw new Error('Usuário não associado a uma empresa.');

  const { businessName, companyName, cnpj, phone } = data;

  if (!businessName || !companyName || !cnpj) {
    throw new Error('Campos obrigatórios ausentes.');
  }

  // Validações
  try {
    const cleanCnpj = new Cnpj(cnpj).toString();
    data.cnpj = cleanCnpj;

    if (phone) {
      const cleanPhone = new Phone(phone).toString();
      data.phone = cleanPhone;
    }
  } catch (error) {
    throw new Error(`Erro de validação: ${error.message}`);
  }

  const exists = await ServiceProvider.findOne({ where: { cnpj: data.cnpj } });
  if (exists) throw new Error('CNPJ já cadastrado.');

  const newProvider = await ServiceProvider.create({
    businessName,
    companyName,
    cnpj: data.cnpj,
    phone: data.phone || null,
    companyId,
  });

  return newProvider;
}

async function updateServiceProvider(id, data, companyId) {
  if (!companyId) throw new Error('Usuário não associado a uma empresa.');

  const provider = await ServiceProvider.findOne({ where: { id, companyId } });
  if (!provider) throw new Error('Fornecedor não encontrado.');

  const { cnpj, phone, ...fields } = data;

  // Validações opcionais
  try {
    if (cnpj) fields.cnpj = new Cnpj(cnpj).toString();
    if (phone) fields.phone = new Phone(phone).toString();
  } catch (error) {
    throw new Error(`Erro de validação: ${error.message}`);
  }

  await provider.update(fields);
  return provider;
}

async function deleteServiceProvider(id, companyId) {
  if (!companyId) throw new Error('Usuário não associado a uma empresa.');

  const provider = await ServiceProvider.findOne({ where: { id, companyId } });
  if (!provider) throw new Error('Fornecedor não encontrado.');

  await provider.destroy();
}

module.exports = {
  getAllByCompany,
  getById,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
};
