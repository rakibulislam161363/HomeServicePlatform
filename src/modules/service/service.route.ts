import { Router } from "express";
import { serviceController } from "./service.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router()

router.post(
  "/",
  auth(Role.TECHNICIAN),
  serviceController.createService
);
router.get("/", serviceController.getAllServices);
router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  serviceController.updateService
);

router.delete(
  "/:id",
  auth(Role.TECHNICIAN),
  serviceController.deleteService
);

export const routerService = router;