"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("./dotenv"));
const cloudflare_1 = __importDefault(require("./cloudflare"));
(0, dotenv_1.default)();
exports.default = {
    loadEnvs: dotenv_1.default,
    cf: (0, cloudflare_1.default)(),
};
