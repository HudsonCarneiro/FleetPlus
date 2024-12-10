const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('../models/Client');
const Address = require('../models/Address');
const User = require('../models/User');
const addressController = require('./addressController');

// Função para criar um novo cliente com endereço
exports.createClient = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { businessName, companyName, cnpj, phone, email, address, userId } = req.body;

    // Verifique se o CNPJ ou o Email já existem
    const existingClient = await Client.findOne({
      where: {
        [Op.or]: [{ cnpj }, { email }],
      },
    });

    if (existingClient) {
      return res.status(400).json({ message: 'CNPJ ou Email já cadastrados.' });
    }

    // Criação do endereço e do cliente usando transação
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
      userId,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(client);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
  }
};

// Função para listar todos os clientes com paginação
exports.getClientAll = async (req, res) => {
  try {
    // Busca todos os clientes
    const clientsResponse = await Client.findAll();

    // Itera sobre os clientes para buscar seus endereços
    const clientsWithAddress = await Promise.all(
      clientsResponse.map(async (client) => {
        const address = await addressController.getAddressbyId(client.addressId);
        return {
          ...client.toJSON(), // Converte o cliente para JSON
          address, // Adiciona o endereço correspondente
        };
      })
    );

    res.status(200).json({
      clients: clientsWithAddress,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao listar clientes.', error: error.message });
  }
};


// Função para obter um cliente específico por ID, incluindo o endereço e usuário
exports.getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o cliente pelo ID
    const client = await Client.findOne({
      where: { id },
      attributes: ['id', 'businessName', 'companyName', 'cnpj', 'email', 'phone', 'addressId', 'userId'], // Inclui `addressId` e `userId` para buscar dados associados
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Busca o endereço do cliente usando a função reutilizável
    const address = await addressController.getAddressbyId(client.addressId);

    // Inclui o endereço e retorna os dados do cliente
    const clientWithAddress = {
      ...client.toJSON(),
      address, // Inclui o endereço no cliente
    };

    res.status(200).json(clientWithAddress);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao obter cliente.', error: error.message });
  }
};


// Função para atualizar um cliente e seu endereço
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { businessName, companyName, cnpj, phone, email, address, userId } = req.body;

  const t = await sequelize.transaction();
  try {
    // Busca o cliente pelo ID
    const client = await Client.findByPk(id);

    if (!client) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Verifica se o CNPJ ou Email já existem, excluindo o cliente atual
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

    // Atualizar o endereço usando a função reutilizável
    if (address) {
      await addressController.updateAddressbyId(client.addressId, address);
    }

    // Atualizar os dados do cliente
    const updatedClient = await client.update({
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      userId,
    }, { transaction: t });

    await t.commit();
    res.status(200).json(updatedClient);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
  }
};


// Função para excluir um cliente e seu endereço
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Excluir o cliente primeiro
    await client.destroy({ transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Cliente excluído com sucesso.' });
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao excluir cliente.', error: error.message });
  }
};

