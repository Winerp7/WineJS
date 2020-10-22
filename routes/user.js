const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/signup', userController.directSignup);
router.get('/dashboard', userController.directDashboard);
router.get('/add-device', userController.directAddDevice);


module.exports = router;
