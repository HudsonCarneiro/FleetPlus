const express = require('express');
const deliveryReportController = require('../controllers/deliveryReportController');
const fuelingReportController = require('../controllers/fuelingReportController');

const router = express.Router();

router.get('/deliveries/report', deliveryReportController.exportDeliveriesReport);
router.get('/fuelings/report', fuelingReportController.exportFuelingReport);


module.exports = router;
