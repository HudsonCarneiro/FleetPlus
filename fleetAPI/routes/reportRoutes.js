const express = require('express');
const deliveryReportController = require('../controllers/deliveryReportController');
const driverReportController = require('../controllers/driverReportController');
const fuelingReportController = require('../controllers/fuelingReportController');
const maintenanceReportController = require('../controllers/maintenanceReportController');
const vehicleReportController = require('../controllers/vehicleReportController');

const router = express.Router();

router.get('/deliveries/report', deliveryReportController.exportDeliveriesReport);
router.get('./drivers/report', driverReportController.exportDriverReport);
router.get('/fuelings/report', fuelingReportController.exportFuelingReport);
router.get('/maintenances/report', maintenanceReportController.exportMaintenanceReport);
router.get('/vehicles/report', vehicleReportController.exportVehiclesReport);




module.exports = router;
