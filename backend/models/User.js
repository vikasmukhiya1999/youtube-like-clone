import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avatars/svg?seed=default',
    validate: {
      validator: function(v) {
        // Allow both image URLs and DiceBear API URLs
        return /^https?:\/\/.*(\.(jpg|jpeg|png|gif|webp|svg)($|\?)|api\.dicebear\.com)/i.test(v);
      },
      message: 'Profile picture must be a valid image URL'
    }
  },
  subscribers: {
    type: Number,
    default: 0
  },
  subscribedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;