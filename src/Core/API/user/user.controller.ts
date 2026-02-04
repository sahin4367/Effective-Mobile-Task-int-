import { Request, Response } from "express";
import { CustomRequest } from "../../../type/custome-request";
import { User, UserRole } from "../../../DAL/models/users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../../consts";

export class UserController {

    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, birthDate, email, password, role } = req.body;

            const existingUser = await User.findOneBy({ email });
            if (existingUser) {
                res.status(400).json({ message: "Email already exists." });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = User.create({
                fullName,
                birthDate,
                email,
                password: hashedPassword,
                role: role || UserRole.USER,
                isActive: true
            });

            await user.save();

            const { password: _, ...userData } = user;
            res.status(201).json(userData);

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await User.findOneBy({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                res.status(401).json({ message: "Invalid email or password." });
                return;
            }

            if (!user.isActive) {
                res.status(403).json({ message: "Your account is blocked." });
                return;
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                appConfig.JWT_SECRET!,
                { expiresIn: "1d" }
            );

            res.json({ token });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req: CustomRequest, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const currentUser = req.user;

            if (isNaN(targetId)) {
                res.status(400).json({ message: "Invalid user ID format." });
                return;
            }

            if (currentUser?.role !== UserRole.ADMIN && currentUser?.id !== targetId) {
                res.status(403).json({ message: "You do not have permission to view this user." });
                return;
            }

            const user = await User.findOneBy({ id: targetId });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            const { password, ...safeUser } = user;
            res.json(safeUser);

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAll(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (req.user?.role !== UserRole.ADMIN) {
                res.status(403).json({ message: "Access denied. Admins only." });
                return;
            }

            const users = await User.find();
            const safeUsers = users.map(({ password, ...rest }) => rest);

            res.json(safeUsers);

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async block(req: CustomRequest, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const currentUser = req.user;

            if (isNaN(targetId)) {
                res.status(400).json({ message: "Invalid user ID format." });
                return;
            }

            if (currentUser?.role !== UserRole.ADMIN && currentUser?.id !== targetId) {
                res.status(403).json({ message: "You do not have permission to block this user." });
                return;
            }

            const user = await User.findOneBy({ id: targetId });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            user.isActive = false;
            await user.save();

            res.json({ message: "User has been successfully blocked." });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
