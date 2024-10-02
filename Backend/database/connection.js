import mongoose from "mongoose";
export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(`Some Error Occured While Connecting To Database: ${err}`);
    });
};
