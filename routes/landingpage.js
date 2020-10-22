const express = require('express');
const router = express.Router();
const landingpageController = require('../controllers/landingpageController');

/* GET home page. */
router.get('/', landingpageController.landingpage); 

module.exports = router;
