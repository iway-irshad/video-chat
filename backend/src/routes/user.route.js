import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import {
    getRecommendedUsers,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests,
    getRejectedFriendRequests
} from "../controllers/user.controller.js";

const router = express.Router();

// Applied auth middleware to all routes in this router
router.use(protectRoute);

router.get("/recommends", getRecommendedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);
router.get("/rejected-friend-requests", getRejectedFriendRequests);

export default router;
