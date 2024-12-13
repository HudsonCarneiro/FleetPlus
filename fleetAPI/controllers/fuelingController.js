const Fueling = require('../models/Fueling');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const { getDriverbyId } = require('./driverController');
const { getVehiclebyId } = require('./vehicleController');

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

exports.getFuelingAll = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todos os abastecimentos
    const fuelings = await Fueling.findAll({ where: { userId } });

    if (!fuelings || fuelings.length === 0) {
      return res.status(404).json({ error: 'Nenhum abastecimento encontrado.' });
    }

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { 
          status: (statusCode) => ({
            json: resolve,
            send: reject
          })
        }
      );
    }).catch(() => []);

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { 
          status: (statusCode) => ({
            json: resolve,
            send: reject
          })
        }
      );
    }).catch(() => []);

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados de motorista e veículo aos abastecimentos
    const fuelingsWithDetails = fuelings.map((fueling) => {
      const driver = drivers.find((d) => String(d.id) === String(fueling.driverId)) || null;
      const vehicle = vehicles.find((v) => String(v.id) === String(fueling.vehicleId)) || null;

      return {
        ...fueling.toJSON(),
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? { id: vehicle.id, model: vehicle.model, licensePlate: vehicle.plate, mileage: vehicle.mileage }
          : null,
      };
    });

    return res.status(200).json(fuelingsWithDetails);
  } catch (error) {
    console.error('Erro ao listar abastecimentos:', error.message);
    return res.status(500).json({
      error: 'Erro ao listar abastecimentos.',
      details: error.message,
    });
  }
};

// Busca um abastecimento por ID
exports.getFuelingById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const fueling = await Fueling.findOne({
      where: { id: req.params.id, userId },
      include: [
        { model: Driver, attributes: ['id', 'name'] },
        { model: Vehicle, attributes: ['id', 'model', 'licensePlate', 'mileage'] },
      ],
    });

    if (!fueling) {
      return res.status(404).json({ error: 'Abastecimento não encontrado.' });
    }

    res.status(200).json(fueling);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao buscar abastecimento.',
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
    const driver = await Driver.findByPk(driverId, { transaction: t });
    if (!vehicle) {
      await t.rollback();
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    if (!driver) {
      await t.rollback();
      return res.status(404).json({ error: 'Motorista não encontrado.' });
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

// Atualiza um abastecimento e verifica atualizações na quilometragem do veículo
exports.updateFueling = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, driverId, vehicleId, liters, price, mileage, dateFueling } = req.body;
    if (!userId || !driverId || !vehicleId || !mileage) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
    }

    const fueling = await Fueling.findOne({
      where: { id: req.params.id, userId },
      transaction: t,
    });

    if (!fueling) {
      await t.rollback();
      return res.status(404).json({ error: 'Abastecimento não encontrado.' });
    }

    // Atualiza a quilometragem do veículo, se necessário
    const vehicle = await Vehicle.findByPk(vehicleId, { transaction: t });
    if (mileage > vehicle.mileage) {
      await vehicle.update({ mileage }, { transaction: t });
    }

    await fueling.update(
      { driverId, vehicleId, liters, price, mileage, dateFueling },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json(fueling);
  } catch (error) {
    await t.rollback();
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao atualizar abastecimento.',
      details: error.message,
    });
  }
};

// Exclui um abastecimento
exports.deleteFueling = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const fueling = await Fueling.findOne({
      where: { id: req.params.id, userId },
    });

    if (!fueling) {
      return res.status(404).json({ error: 'Abastecimento não encontrado.' });
    }

    await fueling.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Erro ao excluir abastecimento.',
      details: error.message,
    });
  }
};

exports.generateFuelingReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todos os abastecimentos
    const fuelings = await Fueling.findAll({ where: { userId } });

    if (!fuelings.length) {
      return res.status(404).json({ error: 'Nenhum abastecimento encontrado.' });
    }

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) },
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados de motorista e veículo aos abastecimentos
    const suppliesWithDetails = fuelings.map((fueling) => {
      const driver = drivers.find((d) => d.id === fueling.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === fueling.vehicleId) || null;

      return {
        ...fueling.toJSON(),
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              licensePlate: vehicle.licensePlate,
              mileage: vehicle.mileage,
            }
          : null,
      };
    });

    // Cria o conteúdo do relatório
    const reportLines = suppliesWithDetails.map((supply) => {
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

    // Escreve o relatório no arquivo
    fs.writeFileSync(filePath, report);

    // Envia o arquivo para download
    res.download(filePath, `relatorio-abastecimentos-${userId}.txt`, () => {
      fs.unlinkSync(filePath); // Remove o arquivo após o download
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de abastecimentos:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de abastecimentos.',
      details: error.message,
    });
  }
};
