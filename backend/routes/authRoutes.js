const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerCompany, loginCompany } = require('../controllers/authController');

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.post('/companies/register', registerCompany);
router.post('/companies/login', loginCompany);

module.exports = router;
