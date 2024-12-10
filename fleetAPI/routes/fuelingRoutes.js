const express = require('express');
const fuelingController = require('../controllers/fuelingController');

const router = express.Router();

router.get('/fuelings', fuelingController.getFuelingAll);
router.get('/fueling/:id', fuelingController.getFuelingById);
router.post('/fueling', fuelingController.createFueling);
router.put('/fueling/:id', fuelingController.updateFueling);
router.delete('/fueling/:id', fuelingController.deleteFueling);
router.get('/fuelings/report', fuelingController.generateFuelingReport);

module.exports = router;
