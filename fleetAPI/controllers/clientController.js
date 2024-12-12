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
exports.getClientsAll = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todos os clientes associados ao usuário
    const clientsResponse = await Client.findAll({
      where: { userId }, // Certifique-se de que está filtrando por userId
    });

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
    console.error('Erro ao listar clientes:', error.message);
    res.status(500).json({ error: 'Erro ao listar clientes.', details: error.message });
  }
};


//principal:
exports.getClientAll = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não fornecido.' });
    }

    // Busca todos os clientes do usuário
    const clientsResponse = await Client.findAll({ where: { userId } });

    // Itera sobre os clientes para buscar seus endereços
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
exports.getClientbyId = async (clientId, userId) => {
  try {
    if (!userId) {
      throw new Error('ID do usuário não fornecido.');
    }

    const client = await Client.findOne({
      where: { id: clientId, userId },
    });

    if (!client) {
      return null;
    }

    return client;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message);
    throw error;
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

