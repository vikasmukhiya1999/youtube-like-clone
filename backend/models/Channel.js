import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avatars/svg?seed=default',
    validate: {
      validator: function(v) {
        return /^https?:\/\/.*(\.(jpg|jpeg|png|gif|webp|svg)($|\?)|api\.dicebear\.com)/i.test(v);
      },
      message: 'Avatar must be a valid image URL'
    }
  },
  banner: {
    type: String,
    default: 'https://picsum.photos/1920/1080',
    validate: {
      validator: function(v) {
        return /^https?:\/\/.*(\.(jpg|jpeg|png|gif|webp)($|\?)|picsum\.photos)/i.test(v);
      },
      message: 'Banner must be a valid image URL'
    }
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subscriberCount: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  videoCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;