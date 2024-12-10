const Vehicle = require('../models/Vehicle');

// Lista todos os veículos vinculados ao usuário autenticado
exports.getVehicleAll = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const vehicles = await Vehicle.findAll({
            where: { userId },
        });

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar veículos',
            details: error.message,
        });
    }
};

// Busca um veículo por ID, garantindo que pertença ao usuário autenticado
exports.getVehicleById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id, userId },
        });

        if (vehicle) {
            res.status(200).json(vehicle);
        } else {
            res.status(404).json({ error: 'Veículo não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar veículo',
            details: error.message,
        });
    }
};

// Cria um novo veículo vinculado ao usuário autenticado
exports.createVehicle = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const newVehicle = await Vehicle.create(req.body);
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar veículo',
            details: error.message,
        });
    }
};

// Atualiza um veículo, garantindo que pertença ao usuário autenticado
exports.updateVehicle = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id, userId },
        });

        if (vehicle) {
            await vehicle.update(req.body);
            res.status(200).json(vehicle);
        } else {
            res.status(404).json({ error: 'Veículo não encontrado ou não autorizado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar veículo',
            details: error.message,
        });
    }
};

// Deleta um veículo, garantindo que pertença ao usuário autenticado
exports.deleteVehicle = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id, userId },
        });

        if (vehicle) {
            await Vehicle.destroy({
                where: { id: req.params.id, userId },
            });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Veículo não encontrado ou não autorizado.' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar veículo',
            details: error.message,
        });
    }
};
// Atualiza a quilometragem de um veículo
exports.updateVehicleMileage = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'ID do usuário não fornecido.' });
      }
  
      const { vehicleId, mileage } = req.body;
      if (!vehicleId || !mileage) {
        return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
      }
  
      const vehicle = await Vehicle.findOne({
        where: { id: vehicleId, userId },
      });
  
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado ou não autorizado.' });
      }
  
      if (mileage > vehicle.mileage) {
        await vehicle.update({ mileage });
        res.status(200).json({ message: 'Quilometragem atualizada com sucesso.' });
      } else {
        res.status(400).json({ error: 'A quilometragem informada é menor ou igual à atual.' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: 'Erro ao atualizar quilometragem do veículo.',
        details: error.message,
      });
    }
  };
  
