const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.get('/vehicles', vehicleController.getVehicleAll);

router.get('/vehicle/:id', vehicleController.getVehicleById);

router.get('/vehicles/report', vehicleController.exportVehiclesReport);

router.post('/vehicle', vehicleController.createVehicle);

router.put('/vehicle/:id', vehicleController.updateVehicle);

router.delete('/vehicle/:id', vehicleController.deleteVehicle);

router.patch('/vehicle/:id/mileage', vehicleController.updateVehicleMileage);

module.exports = router;