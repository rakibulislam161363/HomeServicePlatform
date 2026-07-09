import Stripe from "stripe";
import { BookingStatus, PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createPayment = async (
  userId: string,
  payload: { bookingId: string }
) => {

  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
    include: {
      customer: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new Error("Unauthorized");
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error("Booking is not accepted yet");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Home Service Booking",
          },
          unit_amount: booking.totalPrice * 100,
        },
        quantity: 1,
      },
    ],

    mode: "payment",

    success_url: `${config.appUrl}/payment-success`,
    cancel_url: `${config.appUrl}/payment-cancel`,

    metadata: {
      bookingId: booking.id,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalPrice,
      transactionId: session.id,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const confirmPayment = async (req: any) => {
  const signature = req.headers["stripe-signature"] as string;

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripe_webhook_secret
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      throw new Error("Booking ID not found");
    }

    await prisma.payment.update({
      where: {
        bookingId,
      },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: session.payment_intent as string,
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
  }

  return {
    received: true,
  };
};
const getMyPayments = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSinglePayment = async (
  paymentId: string,
  userId: string
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }


  if (payment.booking.customerId !== userId) {
    throw new Error("Unauthorized");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getSinglePayment
};

