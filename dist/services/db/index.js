"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.d1 = exports.mongodb = void 0;
const mongo_1 = __importDefault(require("./mongo"));
exports.mongodb = mongo_1.default;
const d1_1 = require("./d1");
Object.defineProperty(exports, "d1", { enumerable: true, get: function () { return d1_1.d1; } });
