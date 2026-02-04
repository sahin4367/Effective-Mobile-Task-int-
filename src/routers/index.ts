import { Router } from "express";
import Usersrouter from "../Core/API/user/user.route";



export const v1Router = Router();


v1Router.use('/users', Usersrouter)

