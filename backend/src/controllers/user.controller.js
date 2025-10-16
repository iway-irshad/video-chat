import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude existing friends
                { _id: { $nin: currentUser.friendRequests } }, // Exclude users with pending friend requests
                { isOnboarded: true } // Only include onboarded users
            ]
        })
        // .select("username email avatarUrl") // Select only necessary fields
        // .limit(10); // Limit to 10 users
        res.status(200).json(recommendedUser);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName email profilePic nativeLanguage learningLanguage"); // Populate friends with selected fields

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getFriends controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) { 
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        // prevent sending request to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found." });
        }

        // Check if they are already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        // Check if a friend request has already been sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user." });
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            recipient: recipientId,
        });
        
        await friendRequest.save();
        
        res.status(201).json({ message: "Friend request sent successfully.", friendRequest });
    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) { 
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        // Check if already accepted
        if (friendRequest.status === "accepted") {
            return res.status(400).json({ message: "This friend request has already been accepted." });
        }

        // Check if already rejected
        if (friendRequest.status === "rejected") {
            return res.status(400).json({ message: "Cannot accept a rejected friend request." });
        }

        // Update the friend request status to 'accepted'
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to the other's friends list
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted." });

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) { 
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        })
            .populate("sender", "fullName profilePic nativeLanguage learningLanguage") // Populate sender details
            .sort({ createdAt: -1 }); // Sort by most recent
        
        const acceptedRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "accepted"
        })
            .populate("sender", "fullName profilePic") // Populate sender details
            .sort({ createdAt: -1 }); // Sort by most recent

        const rejectedRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "rejected"
        })
            .populate("sender", "fullName profilePic") // Populate sender details
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json({ 
            incomingRequests, 
            acceptedRequests,
            rejectedRequests 
        });
    } catch (error) {
        console.error("Error in getFriendRequests controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) { 
    try {
        const pendingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        })
            .populate("recipient", "fullName profilePic nativeLanguage learningLanguage") // Populate recipient details
            .sort({ createdAt: -1 }); // Sort by most recent

        const rejectedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "rejected"
        })
            .populate("recipient", "fullName profilePic nativeLanguage learningLanguage") // Populate recipient details
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json({ 
            pendingRequests, 
            rejectedRequests 
        });
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to reject this friend request." });
        }

        // Check if already accepted or rejected
        if (friendRequest.status === "accepted") {
            return res.status(400).json({ message: "This friend request has already been accepted." });
        }

        if (friendRequest.status === "rejected") {
            return res.status(400).json({ message: "This friend request has already been rejected." });
        }

        // Update the friend request status to 'rejected'
        friendRequest.status = "rejected";
        await friendRequest.save();

        res.status(200).json({ message: "Friend request rejected." });

    } catch (error) {
        console.error("Error in rejectFriendRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}