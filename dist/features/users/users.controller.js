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
const db_1 = require("../db/");
const mongodb_1 = require("mongodb");
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body || {};
        if (!newUser) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const db = db_1.mongodb.getDb();
        const result = yield db.collection('users').insertOne(newUser);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = db_1.mongodb.getDb();
        const users = yield db.collection('users').find().toArray();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', e: error });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = db_1.mongodb.getDb();
        const userId = new mongodb_1.ObjectId(req.params.id);
        if (!userId) {
            res.status(400).json({ error: 'missing user id' });
            return;
        }
        const user = yield db.collection('users').findOne({ _id: userId });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = db_1.mongodb.getDb();
        const userId = new mongodb_1.ObjectId(req.params.id);
        if (!userId) {
            res.status(400).json({ error: 'missing user id' });
            return;
        }
        const result = yield db.collection('users').deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = {
    addUser,
    getUsers,
    getUserById,
    deleteUser
};
