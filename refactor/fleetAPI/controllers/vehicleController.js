const Vehicle = require('../models/vehicleModel');
const fs = require('fs');
const path = require('path');

// Lista todos os veículos do usuário autenticado
exports.getAllVehicles = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

        const vehicles = await Vehicle.getAll(userId);
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar veículos', details: error.message });
    }
};

// Busca um veículo por ID
exports.getVehicleById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

        const vehicle = await Vehicle.getById(req.params.id, userId);
        if (!vehicle) return res.status(404).json({ error: 'Veículo não encontrado.' });

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo', details: error.message });
    }
};

// Cria um novo veículo
exports.createVehicle = async (req, res) => {
    try {
        const { userId, plate, model, automaker, year, fuelType, mileage } = req.body;
        if (!userId || !plate || !model) {
            return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
        }

        const newVehicle = await Vehicle.create({ userId, plate, model, automaker, year, fuelType, mileage });
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar veículo', details: error.message });
    }
};

// Atualiza um veículo
exports.updateVehicle = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

        const updated = await Vehicle.update(req.params.id, userId, req.body);
        if (!updated) return res.status(404).json({ error: 'Veículo não encontrado ou não autorizado.' });

        res.status(200).json({ message: 'Veículo atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar veículo', details: error.message });
    }
};

// Deleta um veículo
exports.deleteVehicle = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

        const deleted = await Vehicle.delete(req.params.id, userId);
        if (!deleted) return res.status(404).json({ error: 'Veículo não encontrado ou não autorizado.' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar veículo', details: error.message });
    }
};

// Atualiza a quilometragem do veículo
exports.updateVehicleMileage = async (req, res) => {
    try {
        const { userId, vehicleId, mileage } = req.body;
        if (!userId || !vehicleId || mileage == null) {
            return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
        }

        const updated = await Vehicle.updateMileage(vehicleId, userId, mileage);
        if (!updated) return res.status(400).json({ error: 'Quilometragem inválida ou veículo não encontrado.' });

        res.status(200).json({ message: 'Quilometragem atualizada com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar quilometragem', details: error.message });
    }
};

// Gera um relatório de veículos
exports.exportVehiclesReport = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido.' });

        const vehicles = await Vehicle.getAll(userId);
        if (!vehicles.length) return res.status(404).json({ error: 'Nenhum veículo encontrado.' });

        const reportLines = vehicles.map(v => `
          ID: ${v.id}
          Placa: ${v.plate}
          Modelo: ${v.model}
          Montadora: ${v.automaker}
          Ano de Fabricação: ${v.year}
          Combustível: ${v.fuelType}
          Quilometragem: ${v.mileage}
          ------------------------------------------------------------`).join('\n');

        const filePath = path.join(__dirname, `vehicle-report-${userId}.txt`);
        fs.writeFileSync(filePath, reportLines);

        res.download(filePath, `relatorio-veiculos-${userId}.txt`, () => fs.unlinkSync(filePath));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
    }
};
