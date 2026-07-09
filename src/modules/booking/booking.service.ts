
import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IBookingPayload } from "./booking.interface";

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

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: payload.serviceId,
      bookingDate: new Date(payload.bookingDate),
      address: payload.address,
      note: payload.note,
      totalPrice: service.price,
      status: BookingStatus.REQUESTED,
    },
    include: {
      customer: true,
      technician: true,
      service: true,
    },
  });

  return result;
};

const getMyBookings = async (userId: string, role: string) => {
  if (role === Role.CUSTOMER) {
    return await prisma.booking.findMany({
      where: {
        customerId: userId,
      },
      include: {
        customer: true,
        technician: true,
        service: true,
      },
    });
  }

  if (role === Role.TECHNICIAN) {
    return await prisma.booking.findMany({
      where: {
        technicianId: userId,
      },
      include: {
        customer: true,
        technician: true,
        service: true,
      },
    });
  }

  return await prisma.booking.findMany({
    include: {
      customer: true,
      technician: true,
      service: true,
    },
  });
};

const getSingleBooking = async (bookingId: string) => {
  const result = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      payment: true,
    },
  });

  return result;
};

const updateBooking = async (
  bookingId: string,
  payload: {
    status: BookingStatus;
  }
) => {
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const deleteBooking = async (bookingId: string) => {
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