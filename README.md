# YouTube Clone

A full-stack YouTube clone built with React, Node.js, Express, and MongoDB. This project implements core YouTube functionalities with a modern tech stack and responsive design.

## Tech Stack

### Frontend
- React (v19) with Vite for fast development
- React Router v7 for navigation
- Tailwind CSS for styling
- Heroicons for icons
- Context API for state management
- Lodash for utility functions
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests
- Morgan for HTTP request logging

## Features

### Authentication & User Management
- User registration and login
- JWT-based authentication
- Protected routes

### Video Features
- Video playback using embedded YouTube player
- Video categorization
- Like/dislike functionality
- View counting
- Related videos suggestions

### Social Features
- Comments with CRUD operations
- Comment likes

### Search & Discovery
- Video search functionality
- Category-based filtering
- Trending videos section

### Responsive Design
- Mobile-first approach
- Responsive sidebar
- Adaptive video grid
- Touch-friendly interface

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/youtube-clone
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Database Seeding
To populate the database with sample data:
```bash
cd backend
node scripts/seed.js
```

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── pages/         # Route components
│   ├── constants/     # Constants and config
│   └── utils/         # Utility functions
```

### Backend Structure
```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
└── scripts/         # Utility scripts
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/verify - Verify JWT token

### Videos
- GET /api/videos/search - Search videos
- GET /api/videos/:id - Get video details
- POST /api/videos/:id/like - Toggle video like
- POST /api/videos/:id/dislike - Toggle video dislike

### Comments
- POST /api/comments - Create comment
- GET /api/comments/video/:videoId - Get video comments
- PUT /api/comments/:id - Update comment
- DELETE /api/comments/:id - Delete comment


## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Heroicons](https://heroicons.com/)
- [Dev Community](https://dev.to/) - and a lot For inspiration and knowledge sharing

