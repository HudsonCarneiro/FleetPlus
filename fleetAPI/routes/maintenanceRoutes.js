const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

// Rotas protegidas com autenticação
router.get('/maintenances', maintenanceController.getMaintenances);
router.get('/maintenances/:id', maintenanceController.getMaintenanceById);
router.post('/maintenances', maintenanceController.createMaintenance);
router.put('/maintenances/:id', maintenanceController.updateMaintenance);
router.patch('/maintenances/:id/status', maintenanceController.updateMaintenanceStatus);
router.delete('/maintenances/:id', maintenanceController.deleteMaintenance);

module.exports = router;
