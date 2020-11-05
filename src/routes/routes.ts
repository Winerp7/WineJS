import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';
import * as landingpageController from '../controllers/landingpageController';
import * as nodeController from '../controllers/nodeController';
import { catchErrors } from '../util/errorHandlers'; 

router.get('/signup', userController.directSignup);
router.get('/dashboard', catchErrors(userController.directDashboard));
router.get('/add-device', userController.directAddDevice);
router.post('/add-user', userController.createUser);
router.get('/settings', userController.directSettings);


router.get('/add-node', nodeController.addNode);
router.post('/add-node', catchErrors(nodeController.createNode));
router.post('/add-node/:id', catchErrors(nodeController.updateNode));
router.get('/nodes',
  catchErrors(nodeController.fetchNodes),
  nodeController.getNodes
);
router.get('/nodes/:id/edit', catchErrors(nodeController.editNode))

router.get('/', landingpageController.landingpage); 

export { router };