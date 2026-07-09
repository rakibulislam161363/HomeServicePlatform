import { BookingStatus } from "../../../generated/prisma/enums";


export interface IBookingPayload {
  serviceId: string;
  bookingDate: string;
  address: string;
  note?: string;
}

export interface IUpdateBookingPayload {
  status: BookingStatus;
}