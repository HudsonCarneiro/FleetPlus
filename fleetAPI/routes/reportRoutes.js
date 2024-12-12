const express = require('express');
const deliveryReportController = require('../controllers/deliveryReportController');

const router = express.Router();

router.get('/deliveries/report', deliveryReportController.exportDeliveriesReport);


module.exports = router;
