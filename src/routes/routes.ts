import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';
import * as landingpageController from '../controllers/landingpageController';
import * as nodeController from '../controllers/nodeController';
import * as authController from '../controllers/authController';
import * as piController from '../controllers/piController';
import { catchErrors } from '../util/errorHandlers';
import { validateSettings } from '../util/validator';


router.get('/dashboard', authController.isLoggedIn, catchErrors(nodeController.fetchNodes), catchErrors(userController.directDashboard));
router.post('/dashboard', catchErrors(userController.updateFilters));

router.get('/settings', authController.isLoggedIn, userController.settings);
router.post('/settings/:userSetting', validateSettings, catchErrors(userController.updateSettings));

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/edit-device', authController.isLoggedIn, userController.directEditDevice);

router.get('/functionality', authController.isLoggedIn, userController.directFunctionality);
router.get('/functionality/add', authController.isLoggedIn, userController.addFunctionality);
router.get('/functionality/:id/edit', authController.isLoggedIn, userController.editFunctionality);
// ! Are we keeping this?
router.get('/getFunc', catchErrors(userController.getOneFunctions));

router.get('/account/delete', catchErrors(userController.deleteAccount));
router.post('/account/forgotPassword', catchErrors(authController.forgotPassword));
router.get('/account/reset/:token', catchErrors(userController.resetPassword));
router.post('/account/reset/:token',
  authController.confirmResetPassword,
  catchErrors(authController.updateResetPassword)
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

router.post('/pi/updateSensorData', piController.updateSensorData);
router.post('/pi/updateStatus/:id', catchErrors(piController.updateStatus));
router.post('/pi/updateLoad', catchErrors(piController.updateLoad));
router.post('/pi/initNode', piController.initNode);
router.get('/pi/getFunctionality', catchErrors(piController.getFunctionality));

router.get('/', landingpageController.landingpage);

export { router };