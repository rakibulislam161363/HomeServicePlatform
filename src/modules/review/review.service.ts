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

  const stats = await prisma.review.aggregate({
    where: {
      technicianId: booking.technicianId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.technicianProfile.update({
    where: {
      userId: booking.technicianId,
    },
    data: {
      rating: Number((stats._avg.rating ?? 0).toFixed(1)),
      totalReviews: stats._count.rating,
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

  const result = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  const reviews = await prisma.review.findMany({
    where: {
      technicianId: review.technicianId,
    },
  });

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, item) => sum + item.rating, 0) /
        reviews.length;

  await prisma.technicianProfile.update({
    where: {
      userId: review.technicianId,
    },
    data: {
      rating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    },
  });

  return result;
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

  const reviews = await prisma.review.findMany({
    where: {
      technicianId: review.technicianId,
    },
  });

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, item) => sum + item.rating, 0) /
        reviews.length;

  await prisma.technicianProfile.update({
    where: {
      userId: review.technicianId,
    },
    data: {
      rating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    },
  });

  return {
    message: "Review deleted successfully",
  };
};
const getMyReviews = async (technicianId: string) => {
  return prisma.review.findMany({
    where: {
      technicianId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
const getMyReviewByBooking = async (
  bookingId: string,
  customerId: string
) => {
  return prisma.review.findFirst({
    where: {
      bookingId,
      customerId,
    },
  });
};

export const reviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  getMyReviews,
  getMyReviewByBooking,
  deleteReview,
};