import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';
import * as landingpageController from '../controllers/landingpageController';
import * as nodeController from '../controllers/nodeController';
import * as authController from '../controllers/authController';
import * as piController from '../controllers/piController';
import { catchErrors } from '../util/errorHandlers';


router.get('/dashboard', authController.isLoggedIn, catchErrors(userController.directDashboard));
router.get('/settings', authController.isLoggedIn, userController.settings);
router.post('/settings', catchErrors(userController.updateSettings));


router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/add-node', authController.isLoggedIn, nodeController.addNode);
router.post('/add-node', catchErrors(nodeController.createNode));
router.post('/add-node/:id', catchErrors(nodeController.updateNode));
router.get('/nodes/:id/edit', catchErrors(nodeController.editNode));
router.get('/nodes',
  authController.isLoggedIn,
  catchErrors(nodeController.fetchNodes),
  nodeController.getNodes
);

router.post('/pi/updateSensorData/:id', piController.updateSensorData);
router.post('/pi/initNode', piController.initNode);

router.get('/', landingpageController.landingpage);

export { router };