import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.get(
  "/my-reviews",
  auth(Role.TECHNICIAN),
  reviewController.getMyReviews
);

router.post(
  "/",
  auth(Role.CUSTOMER),
  reviewController.createReview
);

router.get(
  "/",
  reviewController.getAllReviews
);
router.get(
  "/booking/:bookingId",
  auth(Role.CUSTOMER),
  reviewController.getMyReviewByBooking
);

router.get(
  "/:id",
  reviewController.getSingleReview
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  reviewController.updateReview
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER),
  reviewController.deleteReview
);

export const reviewRoute = router;