"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheService = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
class InMemoryCacheService {
    constructor(ttlSeconds = 600) {
        this.cache = new node_cache_1.default({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 }); // Check every 20% of TTL
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    del(keys) {
        this.cache.del(keys);
    }
    flush() {
        this.cache.flushAll();
    }
    getKeys() {
        return this.cache.keys();
    }
}
exports.InMemoryCacheService = InMemoryCacheService;
