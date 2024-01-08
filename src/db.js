import mongoose from "mongoose";

import { MONGODB_URI } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
