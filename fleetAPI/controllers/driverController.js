const Driver = require('../models/Driver');

// Lista todos os motoristas vinculados ao usuário autenticado
exports.getDriverAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const drivers = await Driver.findAll({
      where: { userId },
    });

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar motoristas',
      details: error.message,
    });
  }
};

// Busca um motorista por ID, garantindo que pertença ao usuário autenticado
exports.getDriverById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const driver = await Driver.findOne({
      where: { id: req.params.id, userId },
    });

    if (driver) {
      res.status(200).json(driver);
    } else {
      res.status(404).json({ error: 'Motorista não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar motorista',
      details: error.message,
    });
  }
};
exports.getDriverbyId = async (id) => {
  try {
    const driver = await Driver.findByPk(id, { attributes: ['id', 'name'] });
    return driver ? driver.toJSON() : null;
  } catch (error) {
    console.error(`Erro ao buscar motorista com ID ${id}:`, error.message);
    return null;
  }
};

// Cria um novo motorista vinculado ao usuário autenticado
exports.createDriver = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const newDriver = await Driver.create(req.body);
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar motorista',
      details: error.message,
    });
  }
};

// Atualiza um motorista, garantindo que pertença ao usuário autenticado
exports.updateDriver = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const driver = await Driver.findOne({
      where: { id: req.params.id, userId },
    });

    if (driver) {
      await driver.update(req.body);
      res.status(200).json(driver);
    } else {
      res.status(404).json({ error: 'Motorista não encontrado ou não autorizado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar motorista',
      details: error.message,
    });
  }
};

// Deleta um motorista, garantindo que pertença ao usuário autenticado
exports.deleteDriver = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const driver = await Driver.findOne({
      where: { id: req.params.id, userId },
    });

    if (driver) {
      await Driver.destroy({
        where: { id: req.params.id, userId },
      });
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Motorista não encontrado ou não autorizado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar motorista',
      details: error.message,
    });
  }
};
