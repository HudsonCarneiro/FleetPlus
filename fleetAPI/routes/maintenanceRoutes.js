const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas com autenticação
router.get('/maintenances', maintenanceController.getMaintenances);
router.get('/maintenance/:id', maintenanceController.getMaintenanceById);
router.post('/maintenance', maintenanceController.createMaintenance);
router.put('/maintenance/:id', maintenanceController.updateMaintenance);
router.patch('/maintenance/:id/status',  maintenanceController.updateMaintenanceStatus);
router.delete('/maintenance/:id',  maintenanceController.deleteMaintenance);

module.exports = router;
