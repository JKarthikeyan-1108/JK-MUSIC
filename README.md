<h1 align="center">JK MUSIC ✨</h1>

<p align="center">
  A fully-featured realtime music streaming application built with the MERN stack.
</p>

![Demo App](/frontend/public/jk-music-logo.png)

## Features

-   🎸 **Music Streaming**: Listen to music, control playback, skip, and rewind.
-   🔈 **Volume Control**: Update the volume with a responsive UI slider.
-   🎧 **Admin Dashboard**: Secure admin area to create and manage albums and songs.
-   💬 **Real-time Chat**: Integrated chat application to talk with other users.
-   👨🏼‍💼 **Real-time Presence**: See online and offline status of your friends.
-   👀 **Live Activity**: See what other users are listening to in real-time!
-   📊 **Analytics**: Aggregate data for the admin dashboard.
-   🔐 **Authentication**: Secure login and user management powered by Clerk.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Zustand, Vite
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Media Storage**: Cloudinary (for album art & audio files)
- **Auth**: Clerk

## Setup Instructions

### 1. Backend Setup

Create a `.env` file in the `backend` folder and add your configuration details:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAIL=your_admin_email
NODE_ENV=development

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Install backend dependencies and start the development server:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup

Create a `.env` file in the `frontend` folder:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_vite_clerk_publishable_key
```

Install frontend dependencies and start the app:
```bash
cd frontend
npm install
npm run dev
```
