import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IBookingPayload } from "./booking.interface";

export const bookingInclude = {
  customer: {
    omit: {
      password: true,
    },
  },

  technician: {
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  },

  service: {
    include: {
      category: true,
    },
  },
};

const createBooking = async (
  customerId: string,
  payload: IBookingPayload
) => {
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  // Technician cannot book own service
  if (service.technicianId === customerId) {
    throw new Error("You cannot book your own service");
  }

  // Booking date validation
  const bookingDate = new Date(payload.bookingDate);

  if (bookingDate < new Date()) {
    throw new Error("Booking date cannot be in the past");
  }

  // Prevent duplicate requested booking
  const existingBooking = await prisma.booking.findFirst({
    where: {
      customerId,
      serviceId: payload.serviceId,
      status: BookingStatus.REQUESTED,
    },
  });

  if (existingBooking) {
    throw new Error("You already requested this service");
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: payload.serviceId,
      bookingDate,
      address: payload.address,
      note: payload.note,
      totalPrice: service.price,
      status: BookingStatus.REQUESTED,
    },
    include: bookingInclude,
  });

  return result;
};

const getMyBookings = async (
  userId: string,
  role: string
) => {
  if (role === Role.CUSTOMER) {
    return prisma.booking.findMany({
      where: {
        customerId: userId,
      },
      include: bookingInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (role === Role.TECHNICIAN) {
    return prisma.booking.findMany({
      where: {
        technicianId: userId,
      },
      include: bookingInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return prisma.booking.findMany({
    include: bookingInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleBooking = async (
  bookingId: string
) => {
  return prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      ...bookingInclude,
      payment: true,
      review: true,
    },
  });
};

const updateBooking = async (
  bookingId: string,
  payload: {
    status: BookingStatus;
  }
) => {
  const booking =
    await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

  if (
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error(
      "Completed booking cannot be updated"
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: payload.status,
    },
  });
};

const deleteBooking = async (
  bookingId: string
) => {
  const booking =
    await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

  if (
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error(
      "Completed booking cannot be deleted"
    );
  }

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });

  return null;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};