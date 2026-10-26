import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDatabase() {
  await mongoose.connect(config.mongoUri);
  return mongoose.connection;
}

export function databaseReady() {
  return mongoose.connection.readyState === 1;
}
