const Fueling = require('../models/Fueling');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const fs = require('fs');
const path = require('path');

// Lista todos os abastecimentos vinculados ao usuário autenticado
exports.getFuelingAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const supplies = await Fueling.findAll({
      where: { userId },
      include: [
        { model: Driver, attributes: ['id', 'name'] },
        { model: Vehicle, attributes: ['id', 'model', 'licensePlate', 'mileage'] },
      ],
    });

    res.status(200).json(supplies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao listar abastecimentos.',
      details: error.message,
    });
  }
};

// Cria um novo abastecimento e atualiza a quilometragem do veículo, se necessário
exports.createFueling = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, driverId, vehicleId, liters, price, mileage, dateFueling } = req.body;
    if (!userId || !driverId || !vehicleId || !mileage) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
    }

    // Encontra o veículo para verificar e atualizar a quilometragem
    const vehicle = await Vehicle.findByPk(vehicleId, { transaction: t });
    if (!vehicle) {
      await t.rollback();
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }

    if (mileage > vehicle.mileage) {
      await vehicle.update({ mileage }, { transaction: t });
    }

    const newFueling = await Fueling.create(
      {
        userId,
        driverId,
        vehicleId,
        liters,
        price,
        mileage,
        dateFueling,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(newFueling);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao criar abastecimento.',
      details: error.message,
    });
  }
};

// Gera um relatório em .txt de todos os abastecimentos
exports.generateFuelingReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const supplies = await Fueling.findAll({
      where: { userId },
      include: [
        { model: Driver, attributes: ['name'] },
        { model: Vehicle, attributes: ['model', 'licensePlate'] },
      ],
    });

    if (supplies.length === 0) {
      return res.status(404).json({ error: 'Nenhum abastecimento encontrado.' });
    }

    const reportLines = supplies.map((supply) => {
      return `Data: ${new Date(supply.dateFueling).toLocaleDateString()}
        Motorista: ${supply.Driver?.name || 'Desconhecido'}
        Veículo: ${supply.Vehicle?.model || 'Desconhecido'} (${supply.Vehicle?.licensePlate || 'Placa desconhecida'})
        Litros: ${supply.liters}L
        Preço: R$ ${supply.price}
        Quilometragem: ${supply.mileage} km
        ------------------------------------------------------------`;
    });

    const report = reportLines.join('\n\n');
    const filePath = path.join(__dirname, `fueling-report-${userId}.txt`);

    fs.writeFileSync(filePath, report);

    res.download(filePath, `relatorio-abastecimentos-${userId}.txt`, () => {
      fs.unlinkSync(filePath); // Remove o arquivo após o download
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de abastecimentos.',
      details: error.message,
    });
  }
};
