import { Request, Response, NextFunction } from 'express';
export const validateParam = (params: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const param of params) {
            const thisParam = req.params[param];
            if (!thisParam) {
                res.status(400).json({ error: `missing param: ${param}` });
                return
            }
        }
        next();
    }
}