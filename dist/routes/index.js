"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const userController = __importStar(require("../controllers/userController"));
const landingpageController = __importStar(require("../controllers/landingpageController"));
const nodeController = __importStar(require("../controllers/nodeController"));
const errorHandlers_1 = require("../util/errorHandlers");
router.get('/signup', userController.directSignup);
router.get('/dashboard', userController.directDashboard);
router.get('/add-device', userController.directAddDevice);
router.post('/add-user', userController.createUser);
router.get('/settings', userController.directSettings);
router.get('/add-node', nodeController.addNode);
router.post('/add-node', errorHandlers_1.catchErrors(nodeController.createNode));
router.post('/add-node/:id', errorHandlers_1.catchErrors(nodeController.updateNode));
router.get('/nodes', errorHandlers_1.catchErrors(nodeController.fetchNodes), errorHandlers_1.catchErrors(nodeController.getNodes));
router.get('/nodes/:id/edit', errorHandlers_1.catchErrors(nodeController.editNode));
router.get('/', landingpageController.landingpage);
