import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
//@ts-ignore
import sqlParser from 'sql-parser';
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

interface TokenPayload extends JwtPayload {
    userId: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    userId?: string;
    userRole?: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return
    }
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload; // Verify and decode token
        (req as any).userId = decoded.userId;
        (req as any).userRole = decoded.role; // Assuming your payload contains role
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return
    }
}


export function isSqlValid(sqlString: string) {
    try {
        sqlParser.parse(sqlString);
        return true; // Parsing successful, SQL is valid
    } catch (error) {
        console.error("SQL PARSER ERROR: ", error);
        return false; // Parsing failed, SQL is invalid
    }
}