import express, { Application }  from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";

const app: Application = express();


app.use(cors({
    origin: config.appUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


export default app;