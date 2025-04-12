import mongoose from "mongoose";
import process from 'process';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/youtube-clone";
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nPlease make sure that:');
      console.error('1. MongoDB is installed on your system');
      console.error('2. MongoDB service is running');
      console.error('3. MongoDB is accepting connections on port 27017');
      console.error('\nTo fix this:');
      console.error('1. Open Command Prompt as Administrator');
      console.error('2. Run: net start MongoDB');
      console.error('   (If service is not found, MongoDB needs to be installed)');
    }
    process.exit(1);
  }
};

export default connectDB;
