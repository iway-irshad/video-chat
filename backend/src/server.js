import express from "express";
import { ENV } from "./lib/env.js";

import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/api/auth", authRoutes);

// Ensure PORT is defined
if (!ENV.PORT) throw new Error("PORT is not defined in environment variables");

app.listen(ENV.PORT, () => {
  console.log("Server is running on port:", ENV.PORT);
});