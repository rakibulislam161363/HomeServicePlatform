import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";
import { IReviewPayload } from "./review.interface";

const createReview = async (
  customerId: string,
  payload: IReviewPayload
) => {

  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("Unauthorized");
  }

  if (booking.status !== BookingStatus.PAID) {
    throw new Error("Booking is not completed");
  }

  const reviewExists = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
  });

  if (reviewExists) {
    throw new Error("Review already exists");
  }

  const result = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: true,
      technician: true,
      booking: true,
    },
  });

  return result;
};

const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technician: {
        omit: {
          password: true,
        },
      },
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleReview = async (reviewId: string) => {
  return prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technician: {
        omit: {
          password: true,
        },
      },
      booking: true,
    },
  });
};

const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: Partial<IReviewPayload>
) => {

  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });

  if (review.customerId !== customerId) {
    throw new Error("Unauthorized");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

const deleteReview = async (
  reviewId: string,
  customerId: string
) => {

  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });

  if (review.customerId !== customerId) {
    throw new Error("Unauthorized");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const reviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};