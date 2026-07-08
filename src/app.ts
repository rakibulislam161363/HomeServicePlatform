import express, { Application }  from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandaler";
import { categoriesRoute } from "./modules/categories/categories.route";

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


app.use(globalErrorHandler)


export default app;