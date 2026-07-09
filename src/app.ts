import express, { Application }  from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandaler";
import { categoriesRoute } from "./modules/categories/categories.route";
import { routerService } from "./modules/service/service.route";
import { bookingRoute } from "./modules/booking/booking.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { reviewRoute } from "./modules/review/review.route";
import { notFound } from "./middleware/notFoundPage";

const app: Application = express();


app.use(cors({
    origin: config.appUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/services", routerService);
app.use("/api/booking", bookingRoute);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRoute)

app.use(notFound);

app.use(globalErrorHandler)


export default app;