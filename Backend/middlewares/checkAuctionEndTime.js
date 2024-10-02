import mongoose from "mongoose";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { Auction } from "../models/auctionSchema.js";

export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check if the auction ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  // Find auction by ID
  const auction = await Auction.findById(id);

  // If auction does not exist
  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);

  // Validate date formats
  if (isNaN(startTime.getTime())) {
    return next(new ErrorHandler("Invalid auction start time format.", 400));
  }

  if (isNaN(endTime.getTime())) {
    return next(new ErrorHandler("Invalid auction end time format.", 400));
  }

  // Check if auction has not started yet
  if (startTime > now) {
    return next(new ErrorHandler("Auction has not started yet.", 400));
  }

  // Check if auction has already ended
  if (endTime < now) {
    return next(new ErrorHandler("Auction has ended.", 400));
  }

  // Proceed to the next middleware or controller
  next();
});
