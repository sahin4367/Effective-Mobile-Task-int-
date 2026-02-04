import { Router } from "express";
import { useAuth } from "../../Middlewares/user.middleware";
import { isAdmin } from "../../Middlewares/admin.middleware";
import { UserController } from "./user.controller";

const Usersrouter = Router();

Usersrouter.post("/register", UserController.register);
Usersrouter.post("/login", UserController.login);


Usersrouter.get("/", useAuth, isAdmin, UserController.getAll);

Usersrouter.get("/:id", useAuth, UserController.getById);

Usersrouter.patch("/:id/block", useAuth, UserController.block);

export default Usersrouter;