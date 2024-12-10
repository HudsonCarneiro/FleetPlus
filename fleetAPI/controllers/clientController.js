const Client = require('../models/Client');
const Address = require('../models/Address') // Certifique-se de importar ambos os modelos
const addressController = require('./addressController')


exports.getClientAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca os clientes vinculados ao usuário
    const clients = await Client.findAll({
      where: { userId },
    });

    if (clients.length === 0) {
      return res.status(404).json({ error: 'Nenhum cliente encontrado.' });
    }

    // Para cada cliente, buscamos o endereço através do addressController
    for (const client of clients) {
      const addressResponse = await addressController.getAddressbyId({ params: { id: client.addressId } }, res);
      client.dataValues.address = addressResponse; // Atribui o endereço retornado à propriedade address do cliente
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar clientes',
      details: error.message,
    });
  }
};


const Client = require('../models/Client');
const Address = require('../models/Address');

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do cliente não fornecido." });
    }

    // Busca o cliente pelo ID com a associação explícita
    const client = await Client.findOne({
      where: { id },
      include: [
        {
          model: Address,
          as: "address", // Certifique-se de que o alias é o mesmo definido na associação
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Processa os dados
    const clientData = {
      id: client.id,
      businessName: client.businessName,
      companyName: client.companyName,
      cnpj: client.cnpj,
      phone: client.phone,
      email: client.email,
      addressId: client.address?.id || "",
      cep: client.address?.cep || "",
      road: client.address?.road || "",
      number: client.address?.number || "",
      complement: client.address?.complement || "",
      city: client.address?.city || "",
      state: client.address?.state || "",
    };

    res.status(200).json(clientData);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({
      error: "Erro ao buscar cliente",
      details: error.message,
    });
  }
};


// Cria um cliente e o endereço vinculado ao usuário autenticado
exports.createClient = async (req, res) => {
  try {
    const { userId, address, ...clientData } = req.body; // Desestrutura endereço e dados do cliente
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Criar o endereço
    const createdAddress = await Address.create({
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    });

    // Criar o cliente com referência ao endereço
    const newClient = await Client.create({
      ...clientData,
      addressId: createdAddress.id,
      userId,
    });

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar um cliente',
      details: error.message,
    });
  }
};

// Atualiza um cliente e o endereço vinculado
// controller/ClientController.js
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      addressId,
      cep,
      road,
      number,
      complement,
      city,
      state,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do cliente não fornecido." });
    }

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Atualizar os dados do cliente
    await client.update({
      businessName,
      companyName,
      cnpj,
      phone,
      email,
    });

    // Atualizar ou criar os dados do endereço
    if (addressId) {
      const address = await Address.findByPk(addressId);

      if (address) {
        await address.update({
          cep,
          road,
          number,
          complement,
          city,
          state,
        });
      } else {
        console.warn("Endereço não encontrado. Criando novo...");
        await Address.create({
          clientId: client.id,
          cep,
          road,
          number,
          complement,
          city,
          state,
        });
      }
    } else {
      // Caso não exista um endereço associado, cria um novo
      await Address.create({
        clientId: client.id,
        cep,
        road,
        number,
        complement,
        city,
        state,
      });
    }

    res.status(200).json({ message: "Cliente atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({
      error: "Erro ao atualizar cliente.",
      details: error.message,
    });
  }
};

// Exclui um cliente e o endereço vinculado
exports.deleteClient = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
    });

    if (client) {
      // Excluir o cliente
      await Client.destroy({
        where: { id: req.params.id, userId },
      });

      // Opcional: Excluir o endereço associado
      await Address.destroy({
        where: { id: client.addressId },
      });

      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cliente não encontrado ou não autorizado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar cliente',
      details: error.message,
    });
  }
};
