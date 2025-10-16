import { StreamChat } from "stream-chat";
import { ENV } from "../lib/env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("Stream API key and secret must be set in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating/updating Stream user:", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
      // ensure userId is a string
      const userIdStr = userId.toString();
      return streamClient.createToken(userIdStr);
    } catch (error) {
      console.error("Error generating Stream token:", error);
      throw error;
    }
  };