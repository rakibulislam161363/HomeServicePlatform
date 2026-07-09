import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { PaymentStatus, BookingStatus } from "../../../generated/prisma/enums";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.log("Booking ID not found");
    return;
  }

  await prisma.payment.update({
    where: {
      bookingId,
    },
    data: {
      transactionId: session.id,
      status: PaymentStatus.SUCCESS,
      paidAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BookingStatus.PAID,
    },
  });
};