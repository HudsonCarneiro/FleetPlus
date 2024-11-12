const express = require('express');
const deliveryOrderController = require('../controllers/deliveryOrderController');

const router = express.Router();

router.get('/deliveries', deliveryOrderController.getDeliveryOrderAll);

router.get('/delivery/:id', deliveryOrderController.getDeliveryOrderById);

router.post('/delivery', deliveryOrderController.createDeliveryOrder);

router.put('/delivery/:id', deliveryOrderController.updateDeliveryOrder);

router.delete('/delivery/:id', deliveryOrderController.deleteDeliveryOrder);

module.exports = router;