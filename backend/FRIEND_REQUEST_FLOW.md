# Friend Request Flow & Notification System

## Overview
This document explains how friend requests work and how users are notified about rejected requests.

## Friend Request Lifecycle

### 1. **Sending a Friend Request**
- **Endpoint**: `POST /api/users/friend-request/:id`
- **Action**: User A sends a friend request to User B
- **Status**: `pending`
- **Result**: Friend request is created and saved in the database

### 2. **Recipient Actions**
User B (recipient) has two options:

#### Accept the Request
- **Endpoint**: `PUT /api/users/friend-request/:id/accept`
- **Status Change**: `pending` → `accepted`
- **Side Effects**: 
  - Both users are added to each other's friends list
  - Friend request status is updated to `accepted`

#### Reject the Request
- **Endpoint**: `PUT /api/users/friend-request/:id/reject`
- **Status Change**: `pending` → `rejected`
- **Side Effects**:
  - Friend request status is updated to `rejected`
  - Users do NOT become friends
  - The request remains in the database for history/tracking

## How Senders Know Their Request Was Rejected

### Option 1: Check Outgoing Requests (Recommended)
**Endpoint**: `GET /api/users/outgoing-friend-requests`

**Response**:
```json
{
  "pendingRequests": [
    // Friend requests still waiting for response
  ],
  "rejectedRequests": [
    {
      "_id": "requestId",
      "sender": "senderId",
      "recipient": {
        "fullName": "John Doe",
        "profilePic": "url",
        "nativeLanguage": "English",
        "learningLanguage": "Spanish"
      },
      "status": "rejected",
      "createdAt": "2025-10-16T10:30:00.000Z",
      "updatedAt": "2025-10-16T12:45:00.000Z"
    }
  ]
}
```

### Option 2: Check All Incoming/Outgoing Requests
**Endpoint**: `GET /api/users/friend-requests`

**Response** (for recipients):
```json
{
  "incomingRequests": [
    // Pending requests you need to accept/reject
  ],
  "acceptedRequests": [
    // Requests you accepted
  ],
  "rejectedRequests": [
    // Requests you rejected
  ]
}
```

## Complete API Endpoints

| Endpoint | Method | Description | Who Can Use |
|----------|--------|-------------|-------------|
| `/api/users/friend-request/:id` | POST | Send a friend request | Any authenticated user |
| `/api/users/friend-request/:id/accept` | PUT | Accept a friend request | Recipient only |
| `/api/users/friend-request/:id/reject` | PUT | Reject a friend request | Recipient only |
| `/api/users/friend-requests` | GET | Get incoming, accepted, and rejected requests | Request recipient |
| `/api/users/outgoing-friend-requests` | GET | Get pending and rejected outgoing requests | Request sender |
| `/api/users/recommends` | GET | Get recommended users to add | Any authenticated user |
| `/api/users/friends` | GET | Get list of friends | Any authenticated user |

## Real-time Notifications (Future Enhancement)

Currently, senders must poll the `/api/users/outgoing-friend-requests` endpoint to check if their requests were rejected. 

For a better user experience, you could implement:
1. **WebSocket/Socket.io**: Real-time notifications when a request is rejected
2. **Push Notifications**: Mobile/browser notifications
3. **Email Notifications**: Send an email when a request is rejected (optional)

## Database Schema

### FriendRequest Model
```javascript
{
  sender: ObjectId,      // User who sent the request
  recipient: ObjectId,   // User who receives the request
  status: String,        // "pending", "accepted", or "rejected"
  createdAt: Date,       // When the request was sent
  updatedAt: Date        // When the status last changed
}
```

## Example User Flow

1. **Alice sends request to Bob**
   - Alice calls: `POST /api/users/friend-request/bob_id`
   - Status: `pending`

2. **Bob rejects the request**
   - Bob calls: `PUT /api/users/friend-request/request_id/reject`
   - Status: `rejected`

3. **Alice checks her outgoing requests**
   - Alice calls: `GET /api/users/outgoing-friend-requests`
   - Response includes the rejected request in `rejectedRequests` array
   - Alice can see: Bob rejected her friend request

## Notes

- Rejected requests are kept in the database for tracking purposes
- Users can potentially send a new friend request after rejection (depending on business logic)
- The `updatedAt` timestamp shows when the request was rejected
- Both sender and recipient can view the history of rejected requests
