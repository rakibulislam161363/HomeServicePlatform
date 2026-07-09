import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";
import express from "express"

const router = Router()

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createPayment
);

;

router.post(
  "/confirm",
  express.raw({ type: "application/json" }),
  paymentController.confirmPayment
);

router.get(
  "/",
  auth(Role.CUSTOMER),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  auth(Role.CUSTOMER),
  paymentController.getSinglePayment
);
export const paymentRouter = router