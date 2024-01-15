import mongoose from "mongoose";

import connectDB from "./src/db.js";

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
