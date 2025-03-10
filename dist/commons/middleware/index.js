"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParam = void 0;
const validateParam = (params) => {
    return (req, res, next) => {
        for (const param of params) {
            const thisParam = req.params[param];
            if (!thisParam) {
                res.status(400).json({ error: `missing param: ${param}` });
                return;
            }
        }
        next();
    };
};
exports.validateParam = validateParam;
