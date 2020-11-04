const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const landingpageController = require('../controllers/landingpageController');
const nodeController = require('../controllers/nodeController');
const { catchErrors } = require('../util/errorHandlers'); 

router.get('/dashboard', userController.directDashboard);
router.get('/add-device', userController.directAddDevice);
router.post('/add-user', userController.createUser);
router.get('/settings', userController.directSettings);


router.get('/add-node', nodeController.addNode);
router.post('/add-node', catchErrors(nodeController.createNode));
router.post('/add-node/:id', catchErrors(nodeController.updateNode));
router.get('/nodes',
  catchErrors(nodeController.fetchNodes),
  catchErrors(nodeController.getNodes)
);
router.get('/nodes/:id/edit', catchErrors(nodeController.editNode))

router.get('/', landingpageController.landingpage); 

module.exports = router;
