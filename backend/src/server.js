import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { config } from "./config/env.js";

app.listen(config.port, "0.0.0.0", () => console.log(`Rental360 API running on port ${config.port}`));

async function connectWithRetry() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed; retrying", error.message);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
