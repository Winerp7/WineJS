"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingpage = void 0;
exports.landingpage = (req, res, next) => {
    res.render('landingpage', { title: 'Our dope ass app', path: '/' });
};
