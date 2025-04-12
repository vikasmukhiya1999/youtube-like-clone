# YouTube Clone Backend

The backend server for the YouTube clone project, built with Node.js, Express, and MongoDB.

## Architecture

### Core Components
- **User Management**: Authentication, authorization
- **Video Management**: Video metadata, views, likes/dislikes
- **Comment System**: comments with CRUD support

### Database Schema

#### User Model
- Username, email, password (hashed)
- Profile picture
- Subscriber count
- Subscribed channels
- Owned channels

#### Video Model
- Title and description
- YouTube video URL
- Thumbnail URL
- Channel reference
- View count
- Like/dislike lists
- Category
- Visibility status

#### Comment Model
- Content
- User reference
- Video reference
- Like list
- Replies list
- Parent comment reference

## API Documentation

### Error Handling
All endpoints follow a consistent error response format:
```json
{
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

### Authentication
All protected routes require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Validation
- YouTube URLs must be valid YouTube watch or short URLs
- Image URLs must be valid JPG, PNG, GIF, WebP, or SVG
- Text fields have maximum lengths
- Email addresses must be valid format

## Development

### Environment Setup
Required environment variables:
```bash
PORT=5000                    # Server port
MONGODB_URI=<uri>           # MongoDB connection string
JWT_SECRET=<secret>         # JWT signing secret
NODE_ENV=development        # Environment (development/production)
```

### Local Development
```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Run production server
npm start

# Run database seeding
node scripts/seed.js
```

## Security

### Implemented Measures
- Password hashing with bcrypt
- JWT token authentication
- Request validation
- CORS configuration
