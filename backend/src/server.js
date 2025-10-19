import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();
const PORT = ENV.PORT;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ENV.FRONTEND_URL || "http://localhost:5173", // Frontend origin
    credentials: true, // Allow frontend to send cookies
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server running in ${ENV.NODE_ENV} mode on port: ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});