// routes/companyRoutes.js
const express = require('express');
const companyController = require('../controllers/companyController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apenas admin ou debug
router.get('/companies', companyController.getCompanies);

// CRUD da empresa vinculada ao usuário autenticado
router.get('/company', authenticateToken, companyController.getCompanyByUser);
router.post('/company', authenticateToken, companyController.createCompany);
router.put('/company', authenticateToken, companyController.updateCompany);
router.delete('/company', authenticateToken, companyController.deleteCompany);

module.exports = router;
