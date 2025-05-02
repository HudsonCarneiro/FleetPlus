const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('../models/Client');
const Address = require('../models/Address');
const Company = require('../models/Company');
const addressController = require('./addressController');

// Criar cliente com endereço, vinculado à empresa
exports.createClient = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { businessName, companyName, cnpj, phone, email, address, companyId } = req.body;

    const existingClient = await Client.findOne({
      where: {
        [Op.or]: [{ cnpj }, { email }],
      },
    });

    if (existingClient) {
      return res.status(400).json({ message: 'CNPJ ou Email já cadastrados.' });
    }

    const createdAddress = await Address.create({
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    }, { transaction: t });

    const client = await Client.create({
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      addressId: createdAddress.id,
      companyId,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(client);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
  }
};

// Buscar todos os clientes de uma empresa
exports.getClientAll = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: 'ID da empresa não fornecido.' });
    }

    const clientsResponse = await Client.findAll({ where: { companyId } });

    const clientsWithAddress = await Promise.all(
      clientsResponse.map(async (client) => {
        const address = await addressController.getAddressbyId(client.addressId);
        return {
          ...client.toJSON(),
          address,
        };
      })
    );

    res.status(200).json(clientsWithAddress);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao listar clientes.', error: error.message });
  }
};

// Buscar cliente por ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findOne({
      where: { id },
      attributes: ['id', 'businessName', 'companyName', 'cnpj', 'email', 'phone', 'addressId', 'companyId'],
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const address = await addressController.getAddressbyId(client.addressId);

    res.status(200).json({
      ...client.toJSON(),
      address,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao obter cliente.', error: error.message });
  }
};

// Atualizar cliente + endereço
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { businessName, companyName, cnpj, phone, email, address, companyId } = req.body;

  const t = await sequelize.transaction();
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const existingClient = await Client.findOne({
      where: {
        [Op.or]: [{ cnpj }, { email }],
        id: { [Op.ne]: id },
      },
    });

    if (existingClient) {
      await t.rollback();
      return res.status(400).json({ message: 'CNPJ ou Email já cadastrados.' });
    }

    if (address) {
      await addressController.updateAddressbyId(client.addressId, address);
    }

    const updatedClient = await client.update({
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      companyId,
    }, { transaction: t });

    await t.commit();
    res.status(200).json(updatedClient);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
  }
};

// Deletar cliente e seu endereço
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Pode-se também deletar o endereço, se quiser:
    // await addressController.deleteAddressbyId(client.addressId);

    await client.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: 'Cliente excluído com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao excluir cliente.', error: error.message });
  }
};
