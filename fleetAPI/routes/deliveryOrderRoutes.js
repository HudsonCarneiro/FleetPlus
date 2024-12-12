const express = require('express');
const deliveryOrderController = require('../controllers/deliveryOrderController');

const router = express.Router();

// Rotas de gerenciamento de ordens de entrega
router.get('/deliveries', deliveryOrderController.getDeliveryOrders); // Lista todas as ordens
router.get('/delivery/:id', deliveryOrderController.getDeliveryOrderById); // Busca uma ordem por ID
router.post('/delivery', deliveryOrderController.createDeliveryOrder); // Cria uma nova ordem
router.put('/delivery/:id', deliveryOrderController.updateDeliveryOrder); // Atualiza uma ordem completa
router.delete('/delivery/:id', deliveryOrderController.deleteDeliveryOrder); // Deleta uma ordem
router.patch('/delivery/:id/status', deliveryOrderController.updateDeliveryOrderStatus); // Atualiza apenas o status

module.exports = router;
