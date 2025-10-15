import { StreamChat } from "stream-chat";
import { ENV } from "../lib/env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("Stream API key and secret must be set in environment variables");
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await serverClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating/updating Stream user:", error);
    }
};

// TODO: generate a stream token for a user

export const generateStreamToken = (userId) => {
    try {
        
    } catch (error) {
        
    }
}