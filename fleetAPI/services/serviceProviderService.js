const ServiceProvider = require ('../models/ServiceProfider.js');
const sequelize = require('../config/database');

const Phone = require('../validators/Phone.js');
const Cnpj = require('../validators/CNPJ.js');

// Buscar todos os prestadores de serviço por usuário
async function getAllByCompany(userId) {
  return await ServiceProvider.findAll({ where: { userId } });
}

// Buscar prestador por ID e usuário
async function getById(id, userId) {
  const provider = await ServiceProvider.findOne({ where: { id, userId } });
  if (!provider) {
    throw new Error('Fornecedor não encontrado.');
  }
  return provider;
}

// Criar prestador de serviço
async function createServiceProvider(data, userId) {
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
  if (exists) {
    throw new Error('CNPJ já cadastrado.');
  }

  const newProvider = await ServiceProvider.create({
    businessName,
    companyName,
    cnpj: data.cnpj,
    phone: data.phone || null,
    userId,
  });

  return newProvider;
}

// Atualizar prestador de serviço
async function updateServiceProvider(id, userId, data) {
  const provider = await ServiceProvider.findOne({ where: { id, userId } });
  if (!provider) {
    throw new Error('Fornecedor não encontrado.');
  }

  const { cnpj, phone, ...fields } = data;

  // Validações opcionais
  try {
    if (cnpj) {
      fields.cnpj = new Cnpj(cnpj).toString();
    }
    if (phone) {
      fields.phone = new Phone(phone).toString();
    }
  } catch (error) {
    throw new Error(`Erro de validação: ${error.message}`);
  }

  await provider.update(fields);
  return provider;
}

// Excluir prestador de serviço
async function deleteServiceProvider(id, userId) {
  const provider = await ServiceProvider.findOne({ where: { id, userId } });
  if (!provider) {
    throw new Error('Fornecedor não encontrado.');
  }

  await provider.destroy();
}

module.exports = {
  getAllByCompany,
  getById,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
};
