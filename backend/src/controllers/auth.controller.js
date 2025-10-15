import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
    
        // check if email is valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists. Try with another one." });
        }

        const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic: randomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })
        } catch (error) {
            console.log("Error upserting Stream user:", error);
        }

        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            // try {
            //     if (!ENV.CLIENT_URL) throw new Error("CLIENT_URL is not set");
            //     await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            //   } catch (error) {
            //     console.error("Failed to send welcome email:", error);
            // }

            return res.status(201).json({
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePic: savedUser.profilePic
            });
        } 
    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // never tell the client which one is incorrect: password or email
        // for security reasons

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true
    });
    return res.status(200).json({ message: "Logout successful" });
};