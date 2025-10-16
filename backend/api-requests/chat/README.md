# Chat API Requests

This directory contains API request examples for testing the Stream Chat integration endpoints.

## Available Endpoints

### 1. Get Stream Chat Token
- **File:** `get-streamToken.http`
- **Method:** `GET`
- **Endpoint:** `/api/chat/token`
- **Auth:** Required (JWT token in cookie)

## How to Test

### Prerequisites
1. Make sure your backend server is running: `npm run dev`
2. Ensure Stream API credentials are set in `.env`:
   ```
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```
3. Have a valid JWT token from logging in

### Using VS Code REST Client Extension

1. Install the **REST Client** extension in VS Code
2. Open the `.http` file you want to test
3. Click the "Send Request" link above the request
4. View the response in the right panel

### Step-by-Step Testing Flow

#### Step 1: Login to get JWT token
```http
# Use post-loginUser.http in ../auth/ directory
POST http://localhost:5001/api/auth/login
```

#### Step 2: Get Stream Chat Token
```http
# Use get-streamToken.http
GET http://localhost:5001/api/chat/token
Cookie: jwt=YOUR_JWT_TOKEN_FROM_STEP_1
```

## What is Stream Chat Token?

The Stream Chat token is **different** from your JWT authentication token:

| Token Type | Purpose | Created By | Used For |
|------------|---------|------------|----------|
| **JWT Token** | App authentication | Your backend | Authenticating API requests to your backend |
| **Stream Token** | Stream Chat authentication | Stream SDK | Connecting to Stream Chat services |

### Token Flow:
```
User Login → JWT Token (your backend)
           ↓
GET /api/chat/token → Stream Chat Token (Stream SDK)
           ↓
Frontend uses Stream Token → Connect to Stream Chat
```

## Expected Responses

### ✅ Success (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlZmVjNjdmODI1YmZkMGE4N2E2MzA2In0.Xuz7xR..."
}
```

### ❌ Error Responses

#### 401 Unauthorized
```json
{
  "message": "Unauthorized - No token provided"
}
```
**Solution:** Make sure you include the JWT token in the Cookie header

#### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```
**Possible causes:**
- Missing `STREAM_API_KEY` or `STREAM_API_SECRET` in `.env`
- Invalid Stream credentials
- Stream service is down

Check the server console for detailed error messages.

## Testing with Different Users

You can test with multiple users to simulate real chat scenarios:

```http
# User 1 gets their token
GET http://localhost:5001/api/chat/token
Cookie: jwt=USER_1_JWT_TOKEN

# User 2 gets their token
GET http://localhost:5001/api/chat/token
Cookie: jwt=USER_2_JWT_TOKEN
```

Each user will receive a unique Stream token based on their user ID.

## Integration with Frontend

Once you verify the endpoint works, your frontend will:

1. Call `GET /api/chat/token` with authenticated request
2. Receive the Stream token
3. Use it to initialize Stream Chat SDK:
   ```javascript
   const client = StreamChat.getInstance(STREAM_API_KEY);
   await client.connectUser(
     { id: userId, name: userName, image: userImage },
     streamToken // Token from this endpoint
   );
   ```

## Troubleshooting

### Token Generation Fails
- Check `.env` file has correct Stream credentials
- Verify Stream credentials at https://getstream.io/dashboard
- Check server console for error messages

### Authentication Issues
- Ensure JWT token hasn't expired
- Verify user is logged in and onboarded
- Check the `protectRoute` middleware is working

### User ID Issues
- Stream tokens are tied to user IDs
- Ensure `req.user.id` exists in the controller
- User must exist in your MongoDB database

## Notes

- Stream tokens don't expire by default (you can configure expiration)
- Each user needs their own unique Stream token
- Tokens are generated on-demand, not stored in database
- The same user can generate multiple tokens (old ones remain valid)

## Related Documentation

- [Stream Chat REST API](https://getstream.io/chat/docs/rest/)
- [Stream Chat Tokens](https://getstream.io/chat/docs/tokens_and_authentication/)
- Main API docs: `../QUICK_REFERENCE.md`
