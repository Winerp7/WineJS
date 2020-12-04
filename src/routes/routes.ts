import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';
import * as landingpageController from '../controllers/landingpageController';
import * as nodeController from '../controllers/nodeController';
import * as authController from '../controllers/authController';
import * as piController from '../controllers/piController';
import * as funcController from '../controllers/functionalityController';
import { catchErrors } from '../util/errorHandlers';
import { validateSettings } from '../util/validator';


router.get('/dashboard', authController.isLoggedIn, catchErrors(nodeController.fetchNodes), catchErrors(userController.directDashboard));
router.post('/dashboard', catchErrors(userController.updateFilters));
router.get('/download/:nodeID', catchErrors(nodeController.fetchNodes), nodeController.downloadData);

router.get('/settings', authController.isLoggedIn, userController.settings);
router.post('/settings/:userSetting', validateSettings, catchErrors(userController.updateSettings));

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/functionality', authController.isLoggedIn, catchErrors(funcController.fetchFunctionality), funcController.getFunctionality);
router.get('/functionality/add', authController.isLoggedIn, funcController.addFunctionality);
router.post('/functionality/add', authController.isLoggedIn, catchErrors(funcController.createFunctionality));
router.get('/functionality/:id/edit', authController.isLoggedIn, funcController.editFunctionality);
router.post('/functionality/:id', authController.isLoggedIn, catchErrors(funcController.updateFunctionality)); 
router.get('/functionality/delete/:id', authController.isLoggedIn, catchErrors(funcController.deleteFunctionality));

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
router.get('/nodes/:id/edit', catchErrors(funcController.fetchFunctionality), nodeController.editNode);
router.post('/add-node/:id', catchErrors(funcController.fetchFunctionality), catchErrors(nodeController.updateNode));
router.get('/nodes',
  authController.isLoggedIn,
  catchErrors(nodeController.fetchNodes),
  nodeController.getNodes
);

router.post('/pi/updateSensorData', piController.updateSensorData);
router.post('/pi/updateNodes', catchErrors(piController.updateNodes));
router.post('/pi/initNode', piController.initNode);
router.get('/pi/getFunctionality', catchErrors(piController.getFunctionality));

router.get('/', landingpageController.landingpage);

export { router };