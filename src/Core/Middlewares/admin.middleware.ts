import { Response, NextFunction } from "express";
import { CustomRequest } from "../../type/custome-request";

export const isAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admin only." });
        return;
    }

    next();
};