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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNode = exports.editNode = exports.getNodes = exports.fetchNodes = exports.createNode = exports.addNode = void 0;
const nodeModel_1 = require("../models/nodeModel");
exports.addNode = (req, res) => {
    req.flash('success', 'some shit');
    res.render('edit-node', { title: 'Add Node', path: '/add-device' });
};
exports.createNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const node = yield (new nodeModel_1.Node(req.body)).save();
    req.flash('success', `Successfully Created ${node.name}.`);
    res.redirect('/');
});
exports.fetchNodes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.nodes = yield nodeModel_1.Node.find();
    next();
});
exports.getNodes = (req, res) => {
    res.render('nodes', { title: 'Your nodes', nodes: req.nodes });
};
exports.editNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const node = yield nodeModel_1.Node.findOne({ _id: req.params.id });
    if (!node) {
        console.log('here should be a proper error 🙂');
    }
    else {
        res.render('edit-node', { title: `Edit ${node.name}`, node: node });
    }
});
exports.updateNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const node = yield nodeModel_1.Node.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true // runs the validators to ensure there is stil name etc.
    }).exec();
    if (!node) {
        // TODO: Add proper handling
        console.log("The node do not exist 🔥");
    }
    else {
        req.flash('success', `Successfully updated <strong>${node.name}</strong>. 
    <a href="/nodes/${node.slug}">View Node --> </a>`);
        res.redirect(`/nodes/${node._id}/edit`);
    }
});
