import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../lib/env.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Not authorized, token missing" });
        if (!ENV.JWT_SECRET) throw new Error("JWT_SECRET is not set in environment variables");

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Not authorized, token invalid" });

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
