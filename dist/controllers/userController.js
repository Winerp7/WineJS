"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directSettings = exports.directAddDevice = exports.directDashboard = exports.directSignup = exports.createUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User');
const canni_1 = require("../util/canni");
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield User.create(req.body);
        res.status(201).json({
            status: 'succes',
            data: {
                user: newUser
            }
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
});
exports.directSignup = (req, res) => {
    res.render('signup', { pageTitle: 'Sign up' });
};
exports.directDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Canvas = yield canni_1.makeCanvas();
    const Draw = yield canni_1.draw();
    res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', canvas: Canvas, draw: Draw });
});
// export function directAddDevice (req: Request, res: Response, next: NextFunction) {
//   res.render('add-device', { pageTitle: 'Ads: Response Device', path: '/add-device'});
// };
exports.directAddDevice = (req, res) => {
    res.render('add-device', { pageTitle: 'Ads: Response Device', path: '/add-device' });
};
exports.directSettings = (req, res) => {
    res.render('settings', { pageTitle: 'Settings', path: '/settings' });
};
