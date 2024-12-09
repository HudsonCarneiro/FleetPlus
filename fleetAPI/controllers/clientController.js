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


// Obtém um cliente por ID, verificando se pertence ao usuário autenticado e incluindo o endereço
exports.getClientById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
      include: [{ model: Address, as: 'Address' }], // Inclui o endereço associado, usando o alias correto
    });

    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar cliente',
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
exports.updateClient = async (req, res) => {
  try {
    const { userId, address, ...clientData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
    });

    if (client) {
      // Atualizar o endereço
      await Address.update(
        {
          cep: address.cep,
          number: address.number,
          road: address.road,
          complement: address.complement,
          city: address.city,
          state: address.state,
        },
        { where: { id: client.addressId } }
      );

      // Atualizar dados do cliente
      await client.update(clientData);

      res.json(client);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado ou não autorizado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar o cliente',
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
