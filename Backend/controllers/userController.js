import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

//REGISTER CONTROLLER

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required", 400));
  }
  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    paytmAccountNumber,
    paypalEmail,
  } = req.body;
  if (!userName || !email || !password || !phone || !address || !role) {
    return next(new ErrorHandler("Please fill full form", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountNumber || !bankAccountName || !bankName) {
      return next(
        new ErrorHandler("Please Provide your full bank details", 400)
      );
    }
    if (!paytmAccountNumber) {
      return next(
        new ErrorHandler("Please provide your paytm account number", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your paypal email", 400));
    }
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User Already Registered", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error"
    );
    return next(
      new ErrorHandler("failed to upload profile image to cloudinary", 500)
    );
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      paytm: {
        paytmAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  generateToken(user, "User Registered", 201, res);
});

//LOGIN CONTROLLER
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Please Fill Full Form", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }
  generateToken(user, "Login Successfull", 200, res);
});

//get profile of current user
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

//logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "User Logout Successfully",
    });
});

//fetchLeaderBoard
export const fetchLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent); //this is used to sort users according to moneyspent
  res.status(200).json({
    success: true,
    leaderboard,
  });
});
