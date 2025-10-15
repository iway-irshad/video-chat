import express from "express";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Ensure PORT is defined
if (!PORT) throw new Error("PORT is not defined in environment variables");

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server running in ${ENV.NODE_ENV} mode on port: ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});