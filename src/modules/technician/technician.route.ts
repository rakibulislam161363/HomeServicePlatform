import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  technicianController.getAllTechnicians
);

router.get(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.getMyProfile
);

router.post(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.createMyProfile
);

router.patch(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateMyProfile
);

router.get(
  "/:id",
  technicianController.getTechnicianById
);

export const technicianRoute = router;