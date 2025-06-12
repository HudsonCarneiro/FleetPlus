const express = require('express');
const driverController = require('../controllers/driverController');

const router = express.Router();

router.get('/drivers', driverController.getDriverAll);

router.get('/driver/:id', driverController.getDriverById);

router.post('/driver', driverController.createDriver);

router.put('/driver/:id', driverController.updateDriver);

router.delete('/driver/:id', driverController.deleteDriver);

module.exports = router;