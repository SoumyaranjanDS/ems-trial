import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(console.log("Mongodb connected successfully"));
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
