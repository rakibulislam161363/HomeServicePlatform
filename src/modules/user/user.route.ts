import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.get("/", auth(Role.ADMIN), userController.getAllUsers);
router.get("/:id", auth(Role.ADMIN), userController.getSingleUser);

router.patch("/:id", auth(Role.ADMIN), userController.updateUser);

router.patch("/:id/status", auth(Role.ADMIN), userController.updateUserStatus);

router.delete("/:id", auth(Role.ADMIN), userController.deleteUser);

export const userRoute = router;