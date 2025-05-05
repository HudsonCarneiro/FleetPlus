const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('../models/Company');
const Address = require('../models/Address');
const addressController = require('./addressController');

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      attributes: ['id', 'cnpj', 'companyName', 'businessName', 'addressId'],
      include: {
        model: Address,
        as: 'address', // Nome da associação (deve ser configurado no model)
      }
    });

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: 'Empresa não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar empresa',
      details: error.message,
    });
  }
};

// Criar empresa com endereço e vincular usuário
exports.createCompany = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cnpj, companyName, businessName, address, userId } = req.body;

    if (!userId) {
      await t.rollback();
      return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
    }

    const existingCompany = await Company.findOne({
      where: { cnpj },
      transaction: t,
    });

    if (existingCompany) {
      await t.rollback();
      return res.status(400).json({ message: 'CNPJ já cadastrado.' });
    }

    const createdAddress = await Address.create({
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    }, { transaction: t });

    const company = await Company.create({
      cnpj,
      companyName,
      businessName,
      addressId: createdAddress.id,
    }, { transaction: t });

    // Atualizar o usuário com o companyId
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado para vincular à empresa.' });
    }

    await user.update({ companyId: company.id }, { transaction: t });

    await t.commit();
    res.status(201).json({ company, message: 'Empresa criada e usuário vinculado com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
  }
};


// Atualizar empresa e seu endereço
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { cnpj, companyName, businessName, address } = req.body;

  const t = await sequelize.transaction();
  try {
    const company = await Company.findByPk(id);

    if (!company) {
      await t.rollback();
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    // Atualiza o endereço, se enviado
    if (address) {
      await addressController.updateAddressbyId(company.addressId, address);
    }

    // Atualiza os dados da empresa
    const updatedCompany = await company.update({
      cnpj,
      companyName,
      businessName,
    }, { transaction: t });

    await t.commit();
    res.status(200).json(updatedCompany);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar empresa.', error: error.message });
  }
};

// Deletar empresa (sem deletar o endereço)
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();
  try {
    const company = await Company.findByPk(id);

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
