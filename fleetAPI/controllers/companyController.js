// controllers/companyController.js
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('../models/Company');
const Address = require('../models/Address');
const addressController = require('./addressController');

// Listar todas as empresas (geral)
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      attributes: ['id', 'companyName', 'businessName', 'cnpj', 'addressId', 'userId'],
      order: [['id', 'ASC']]
    });

    res.status(200).json(companies || []);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    res.status(500).json({ error: "Erro interno ao listar empresas" });
  }
};

// Buscar empresa do usuário autenticado
exports.getCompanyByUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    const company = await Company.findOne({
      where: { userId },
      include: [{ model: Address, as: 'address' }]
    });

    res.status(200).json(company || null);
  } catch (error) {
    console.error("Erro ao buscar empresa por usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar empresa" });
  }
};

// Criar empresa vinculada ao usuário logado
exports.createCompany = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cnpj, companyName, businessName, address } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      await t.rollback();
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const existingCompany = await Company.findOne({ where: { userId }, transaction: t });

    if (existingCompany) {
      await t.rollback();
      return res.status(400).json({ message: 'Usuário já possui uma empresa vinculada.' });
    }

    const createdAddress = await Address.create(address, { transaction: t });

    const company = await Company.create({
      cnpj,
      companyName,
      businessName,
      addressId: createdAddress.id,
      userId
    }, { transaction: t });

    await t.commit();
    return res.status(201).json({
      company,
      message: 'Empresa criada e vinculada ao usuário com sucesso.'
    });
  } catch (error) {
    await t.rollback();
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
  }
};

// Atualizar empresa do usuário autenticado
exports.updateCompany = async (req, res) => {
  const userId = req.user?.id;
  const { cnpj, companyName, businessName, address } = req.body;
  const t = await sequelize.transaction();

  try {
    const company = await Company.findOne({ where: { userId }, transaction: t });

    if (!company) {
      await t.rollback();
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    if (address) {
      await addressController.updateAddressbyId(company.addressId, address);
    }

    const updatedCompany = await company.update({ cnpj, companyName, businessName }, { transaction: t });

    await t.commit();
    res.status(200).json(updatedCompany);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar empresa.', error: error.message });
  }
};

// Deletar empresa do usuário autenticado
exports.deleteCompany = async (req, res) => {
  const userId = req.user?.id;
  const t = await sequelize.transaction();

  try {
    const company = await Company.findOne({ where: { userId }, transaction: t });

    if (!company) {
      await t.rollback();
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    await company.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: 'Empresa excluída com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao excluir empresa.', error: error.message });
  }
};
