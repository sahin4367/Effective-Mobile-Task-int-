import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { appConfig } from "../../consts";
import { CustomRequest } from "../../type/custome-request";
import { User } from "../../DAL/models/users/user.model";

interface JwtPayload {
    id: number;
    role: string;
}

export const useAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || (typeof authHeader === 'string' && !authHeader.startsWith("Bearer "))) {
        res.status(401).json({ message: 'Token format is invalid or not found!' });
        return;
    }

    const tokenStr = Array.isArray(authHeader) ? authHeader[0] : (authHeader as string);
    const access_token = tokenStr.split(" ")[1];

    if (!access_token) {
        res.status(401).json({ message: 'Token not provided!' });
        return;
    }

    try {
        const jwtResult = jwt.verify(access_token, appConfig.JWT_SECRET!) as JwtPayload;

        if (!jwtResult || !jwtResult.id) {
            res.status(401).json({ message: 'Invalid token!' });
            return;
        }

        const user = await User.findOneBy({ id: jwtResult.id });
        if (!user) {
            res.status(401).json({ message: 'User not found!' });
            return;
        }

        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ message: "Unauthorized: " + error.message });
    }
};