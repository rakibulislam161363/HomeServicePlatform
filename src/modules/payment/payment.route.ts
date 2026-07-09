import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { subscriptionController } from "./payment.controller";

const router = Router()

router.post(
    "/checkout", 
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    subscriptionController.createCheckoutSession
)

//cancel subscription

router.post("/webhook", subscriptionController.handleWebhook )


router.get("/status", 
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    subscriptionController.getSubscriptionStatus)

export const subscriptionRoutes = router