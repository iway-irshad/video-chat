# 📚 Quick API Reference Guide

## All Friend Request Endpoints

| Endpoint | Method | Description | Auth | File |
|----------|--------|-------------|------|------|
| `/api/users/friend-request/:id` | POST | Send friend request | ✅ | `post-sendFriendRequest.http` |
| `/api/users/friend-request/:id/accept` | PUT | Accept friend request | ✅ | `put-acceptFriendRequest.http` |
| `/api/users/friend-request/:id/reject` | PUT | Reject friend request | ✅ | `put-rejectFriendRequest.http` |
| `/api/users/friend-requests` | GET | Get incoming requests | ✅ | `get-friendRequests.http` |
| `/api/users/outgoing-friend-requests` | GET | Get outgoing requests | ✅ | `get-outgoingFriendRequests.http` |
| `/api/users/friends` | GET | Get friends list | ✅ | `get-friends.http` |
| `/api/users/recommends` | GET | Get recommended users | ✅ | `get-recommendedUser.http` |

## Copy-Paste Ready Examples

### 1. Send Friend Request
```http
POST http://localhost:5001/api/users/friend-request/USER_ID_HERE
Cookie: jwt=YOUR_JWT_TOKEN
```

### 2. Accept Friend Request
```http
PUT http://localhost:5001/api/users/friend-request/REQUEST_ID_HERE/accept
Cookie: jwt=YOUR_JWT_TOKEN
```

### 3. Reject Friend Request
```http
PUT http://localhost:5001/api/users/friend-request/REQUEST_ID_HERE/reject
Cookie: jwt=YOUR_JWT_TOKEN
```

### 4. Check Incoming Requests
```http
GET http://localhost:5001/api/users/friend-requests
Cookie: jwt=YOUR_JWT_TOKEN
```

### 5. Check Outgoing Requests (See Rejections!)
```http
GET http://localhost:5001/api/users/outgoing-friend-requests
Cookie: jwt=YOUR_JWT_TOKEN
```

### 6. Get Friends List
```http
GET http://localhost:5001/api/users/friends
Cookie: jwt=YOUR_JWT_TOKEN
```

### 7. Get Recommended Users
```http
GET http://localhost:5001/api/users/recommends
Cookie: jwt=YOUR_JWT_TOKEN
```

---

💡 **Tip**: Open any `.http` file in VS Code with the REST Client extension installed to test directly!
