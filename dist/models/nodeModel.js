"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
const slugify_1 = __importDefault(require("slugify"));
const nodeSchema = new mongoose_1.default.Schema({
    nodeID: {
        type: String,
        required: 'A node must have an ID',
        unique: true
    },
    name: {
        type: String,
        required: 'A node must have a name',
        default: 'New Node',
        trim: true
    },
    status: {
        type: String,
        default: 'Is this thing on?'
    },
    slug: String,
    sensors: [String]
});
nodeSchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slugify_1.default(this.name);
    next();
    // TODO: make so slugs are unique
});
// NodeDevice is the table that it should use/create in the DB
const Node = mongoose_1.default.model('NodeDevice', nodeSchema);
exports.Node = Node;
