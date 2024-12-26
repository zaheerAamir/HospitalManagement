import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {

  try {

    const URI = process.env.URI;
    if (URI !== undefined) {
      await mongoose.connect(URI);
      console.log("Connected to DB!")
    }


  } catch (err) {
    throw new Error(err);
  }
}

export default connectDB;
