import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleVideos = [
  {
    title: "Building a React App from Scratch",
    description: "Learn how to build a complete React application from the ground up. Perfect for beginners!",
    videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    thumbnail: "https://picsum.photos/seed/react1/1280/720",
    category: "Programming",
    duration: 3600,
    views: 15000
  },
  {
    title: "Top 10 JavaScript Tips and Tricks",
    description: "Discover the most useful JavaScript tips and tricks that will make you a better developer.",
    videoUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
    thumbnail: "https://picsum.photos/seed/js1/1280/720",
    category: "Programming",
    duration: 1800,
    views: 25000
  },
  {
    title: "Complete Node.js Crash Course",
    description: "Everything you need to know about Node.js in one video.",
    videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
    thumbnail: "https://picsum.photos/seed/node1/1280/720",
    category: "Programming",
    duration: 7200,
    views: 35000
  },
  {
    title: "Summer Mix 2025 🌴 Best Popular Songs",
    description: "The ultimate summer playlist featuring the hottest tracks of 2025.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/music1/1280/720",
    category: "Music",
    duration: 3600,
    views: 100000
  },
  {
    title: "Pro Gaming Strategies: Winning Every Match",
    description: "Learn the secret strategies used by professional gamers to dominate in competitive gaming.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/gaming1/1280/720",
    category: "Gaming",
    duration: 2400,
    views: 50000
  },
  {
    title: "Easy 30-Minute Dinner Recipes",
    description: "Quick and delicious dinner recipes that anyone can make in just 30 minutes!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/cooking1/1280/720",
    category: "Cooking",
    duration: 1800,
    views: 75000
  }
];

const seedDatabase = async () => {
  try {
    // Ensure MongoDB is connected before proceeding
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});

    console.log('Creating test user...');
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      profilePicture: "https://api.dicebear.com/7.x/avatars/svg?seed=testuser"
    });

    console.log('Creating channel...');
    const channel = await Channel.create({
      name: "Tech & Tutorial Channel",
      description: "The best tech tutorials and programming content!",
      owner: user._id,
      avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=techchannel"
    });

    console.log('Linking channel to user...');
    await User.findByIdAndUpdate(user._id, {
      $push: { channels: channel._id }
    });

    console.log('Creating videos...');
    for (const videoData of sampleVideos) {
      const video = await Video.create({
        ...videoData,
        channel: channel._id
      });

      await Channel.findByIdAndUpdate(channel._id, {
        $push: { videos: video._id }
      });
    }

    console.log('\nDatabase seeded successfully! 🎉');
    console.log('\nTest User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\nError seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

seedDatabase();