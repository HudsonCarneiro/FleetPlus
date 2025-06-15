const express = require('express');
const serviceProviderController = require('../controllers/serviceProfiderController')

const router = express.Router();

router.get('/serviceProviders', serviceProviderController.getAllServiceProviders);

router.get('/serviceProvider/:id', serviceProviderController.getServiceProviderById);

router.post('/serviceProvider', serviceProviderController.createServiceProvider);

router.put('/serviceProvider/:id', serviceProviderController.updateServiceProvider);

router.delete('/serviceProvider/:id', serviceProviderController.deleteServiceProvider);

module.exports = router;