import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router();


route.post("/register", authController.createUser);
route.post("/login", authController.loginUser);
route.get("/me",auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authController.getMyProfile);
route.post("/refresh-token", authController.refreshToken);

export const authRoute = route;