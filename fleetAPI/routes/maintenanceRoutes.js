const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas com autenticação
router.get('/maintenances', authenticateToken, maintenanceController.getMaintenances);
router.get('/maintenance/:id', authenticateToken, maintenanceController.getMaintenanceById);
router.post('/maintenance', authenticateToken, maintenanceController.createMaintenance);
router.put('/maintenance/:id', authenticateToken, maintenanceController.updateMaintenance);
router.patch('/maintenance/:id/status', authenticateToken, maintenanceController.updateMaintenanceStatus);
router.delete('/maintenance/:id', authenticateToken, maintenanceController.deleteMaintenance);

module.exports = router;
