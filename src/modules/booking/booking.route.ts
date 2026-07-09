import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

// Customer
router.post(
  "/",
  auth(Role.CUSTOMER),
  bookingController.createBooking
);

// Customer / Technician / Admin
router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getMyBookings
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getSingleBooking
);

// Technician
router.patch(
  "/:id",
  auth(Role.TECHNICIAN,Role.CUSTOMER),
  bookingController.updateBooking
);

// Customer
router.delete(
  "/:id",
  auth(Role.CUSTOMER),
  bookingController.deleteBooking
);


export const bookingRoute = router;