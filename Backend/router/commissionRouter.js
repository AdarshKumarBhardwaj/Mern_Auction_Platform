import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { proofOfCommission } from "../controllers/commissionController.js";

const router = express.Router();
router.post(
  "/proof",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfCommission
);
export default router;
