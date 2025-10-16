# Friend Request API Endpoints

This directory contains HTTP request files for testing all friend request-related endpoints.

## 📋 Available Endpoints

### 1. **Send Friend Request**
- **File**: `post-sendFriendRequest.http`
- **Method**: `POST`
- **Endpoint**: `/api/users/friend-request/:id`
- **Description**: Send a friend request to another user
- **Auth**: Required (JWT in cookie)
- **Params**: User ID of the recipient

### 2. **Accept Friend Request**
- **File**: `put-acceptFriendRequest.http`
- **Method**: `PUT`
- **Endpoint**: `/api/users/friend-request/:id/accept`
- **Description**: Accept a pending friend request
- **Auth**: Required (JWT in cookie)
- **Params**: Friend request ID
- **Note**: Only the recipient can accept

### 3. **Reject Friend Request**
- **File**: `put-rejectFriendRequest.http`
- **Method**: `PUT`
- **Endpoint**: `/api/users/friend-request/:id/reject`
- **Description**: Reject a pending friend request
- **Auth**: Required (JWT in cookie)
- **Params**: Friend request ID
- **Note**: Only the recipient can reject

### 4. **Get Incoming Friend Requests**
- **File**: `get-friendRequests.http`
- **Method**: `GET`
- **Endpoint**: `/api/users/friend-requests`
- **Description**: Get all friend requests you received (incoming)
- **Auth**: Required (JWT in cookie)
- **Returns**:
  - `incomingRequests`: Pending requests waiting for your action
  - `acceptedRequests`: Requests you already accepted
  - `rejectedRequests`: Requests you rejected

### 5. **Get Outgoing Friend Requests**
- **File**: `get-outgoingFriendRequests.http`
- **Method**: `GET`
- **Endpoint**: `/api/users/outgoing-friend-requests`
- **Description**: Get all friend requests YOU sent to others
- **Auth**: Required (JWT in cookie)
- **Returns**:
  - `pendingRequests`: Requests waiting for response
  - `rejectedRequests`: Requests that were rejected ⚠️

### 6. **Get Friends List**
- **File**: `get-friends.http`
- **Method**: `GET`
- **Endpoint**: `/api/users/friends`
- **Description**: Get your current friends list
- **Auth**: Required (JWT in cookie)

### 7. **Get Recommended Users**
- **File**: `get-recommendedUser.http`
- **Method**: `GET`
- **Endpoint**: `/api/users/recommends`
- **Description**: Get recommended users to add as friends
- **Auth**: Required (JWT in cookie)

## 🔐 Authentication

All endpoints require a valid JWT token passed in the cookie header:
```
Cookie: jwt=YOUR_JWT_TOKEN_HERE
```

To get a JWT token:
1. Use the auth endpoints in `api-requests/auth/`
2. Login or create a user account
3. Copy the JWT token from the response cookies

## 📊 Response Examples

### Send Friend Request (Success)
```json
{
  "message": "Friend request sent successfully.",
  "friendRequest": {
    "_id": "507f1f77bcf86cd799439011",
    "sender": "68f12fef0378b341ac4d91b5",
    "recipient": "68f12fef0378b341ac4d91b6",
    "status": "pending",
    "createdAt": "2025-10-17T10:30:00.000Z",
    "updatedAt": "2025-10-17T10:30:00.000Z"
  }
}
```

### Get Outgoing Requests (Success)
```json
{
  "pendingRequests": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "recipient": {
        "fullName": "John Doe",
        "profilePic": "https://example.com/pic.jpg",
        "nativeLanguage": "English",
        "learningLanguage": "Spanish"
      },
      "status": "pending",
      "createdAt": "2025-10-17T10:30:00.000Z"
    }
  ],
  "rejectedRequests": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "recipient": {
        "fullName": "Jane Smith",
        "profilePic": "https://example.com/pic2.jpg",
        "nativeLanguage": "French",
        "learningLanguage": "English"
      },
      "status": "rejected",
      "createdAt": "2025-10-17T09:00:00.000Z",
      "updatedAt": "2025-10-17T09:15:00.000Z"
    }
  ]
}
```

### Accept Friend Request (Success)
```json
{
  "message": "Friend request accepted."
}
```

### Reject Friend Request (Success)
```json
{
  "message": "Friend request rejected."
}
```

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "You cannot send a friend request to yourself."
}
```

```json
{
  "message": "A friend request already exists between you and this user."
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token missing"
}
```

### 403 Forbidden
```json
{
  "message": "You are not authorized to accept this friend request."
}
```

### 404 Not Found
```json
{
  "message": "Friend request not found."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## 🎯 Usage Flow

### Typical Friend Request Flow:

1. **User A wants to add User B**
   - A calls: `POST /api/users/friend-request/:userB_id`
   - Status: `pending`

2. **User B checks incoming requests**
   - B calls: `GET /api/users/friend-requests`
   - Sees A's request in `incomingRequests`

3. **User B accepts or rejects**
   - Accept: `PUT /api/users/friend-request/:request_id/accept`
   - Reject: `PUT /api/users/friend-request/:request_id/reject`

4. **User A checks if request was accepted/rejected**
   - A calls: `GET /api/users/outgoing-friend-requests`
   - If rejected, sees request in `rejectedRequests`
   - If accepted, they are now friends

5. **Both users can view friends**
   - Call: `GET /api/users/friends`

## 🧪 Testing Tips

1. **Use VS Code REST Client Extension**: Install the "REST Client" extension to run .http files directly in VS Code

2. **Replace Placeholder Values**:
   - `YOUR_JWT_TOKEN_HERE` → Your actual JWT token
   - `RECIPIENT_USER_ID_HERE` → Actual MongoDB ObjectId
   - `FRIEND_REQUEST_ID_HERE` → Actual request ID

3. **Test in Order**:
   - First, get recommended users
   - Send a friend request to one
   - Check outgoing requests
   - Login as the other user
   - Check incoming requests
   - Accept or reject
   - Check friends list

4. **Monitor Server Logs**: Watch the terminal running your backend to see request processing

## 📁 File Structure

```
api-requests/
└── user/
    ├── README.md (this file)
    ├── post-sendFriendRequest.http
    ├── put-acceptFriendRequest.http
    ├── put-rejectFriendRequest.http
    ├── get-friendRequests.http
    ├── get-outgoingFriendRequests.http
    ├── get-friends.http
    └── get-recommendedUser.http
```

## 🔗 Related Documentation

- See `FRIEND_REQUEST_FLOW.md` in the backend root for detailed system architecture
- See `api-requests/auth/` for authentication endpoints
