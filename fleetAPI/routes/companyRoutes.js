const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

router.get('/company/:id', companyController.getCompanyById);

router.post('/comapny', companyController.createCompany);

router.put('/company/:id', companyController.updateCompany);

router.delete('/company/:id', companyController.deleteCompany);

module.exports = router;