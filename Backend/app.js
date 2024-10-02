import { config } from "dotenv";
import express from "express";
import { connection } from "./database/connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"; // Add this import
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
const app = express();

config({
  path: "./config/config.env",
});

//Middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

//automation
endedAuctionCron();
verifyCommissionCron();
//database
connection();

//error handling
app.use(errorMiddleware);
export default app;
