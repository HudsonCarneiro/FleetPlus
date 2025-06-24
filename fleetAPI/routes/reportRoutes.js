const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');

const deliveryReportController = require('../controllers/deliveryReportController');
const driverReportController = require('../controllers/driverReportController');
const fuelingReportController = require('../controllers/fuelingReportController');
const maintenanceReportController = require('../controllers/maintenanceReportController');
const vehicleReportController = require('../controllers/vehicleReportController');

const router = express.Router();

router.get('/deliveries/report', authenticateToken, deliveryReportController.exportDeliveriesReport);
router.get('/drivers/report', authenticateToken, driverReportController.exportDriverReport);
router.get('/fuelings/report', authenticateToken, fuelingReportController.exportFuelingReport);
router.get('/maintenances/report', authenticateToken, maintenanceReportController.exportMaintenanceReport);
router.get('/vehicles/report', authenticateToken, vehicleReportController.exportVehiclesReport);

module.exports = router;
