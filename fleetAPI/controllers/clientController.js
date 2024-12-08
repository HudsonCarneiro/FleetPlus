const Client = require('../models/Client');

// Obtém todos os clientes vinculados ao usuário autenticado
exports.getClientAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const clients = await Client.findAll({
      where: { userId },
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar clientes',
      details: error.message,
    });
  }
};

// Obtém um cliente por ID, verificando se pertence ao usuário autenticado
exports.getClientById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
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

// Cria um cliente vinculado ao usuário autenticado
exports.createClient = async (req, res) => {
  try {
    const { userId } = req.body; // O userId deve ser enviado no corpo da requisição
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar um cliente',
      details: error.message,
    });
  }
};

// Atualiza um cliente, verificando se pertence ao usuário autenticado
exports.updateClient = async (req, res) => {
  try {
    const { userId } = req.body; // O userId deve ser enviado no corpo da requisição
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
    });

    if (client) {
      await client.update(req.body);
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

// Exclui um cliente, verificando se pertence ao usuário autenticado
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
      await Client.destroy({
        where: { id: req.params.id, userId },
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
