import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
    if (!ENV.JWT_SECRET) throw new Error("JWT_SECRET is not set");
    const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // JS can't access the cookie and protect against XSS attacks
        sameSite: "strict", // CSRF attacks protection
        secure: ENV.NODE_ENV === "development" ? false : true, // only send cookie over HTTPS in production
    });

    return token;
}