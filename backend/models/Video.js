import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*/.test(v);
      },
      message: 'Video URL must be a valid YouTube URL'
    }
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Allow both regular image URLs and Picsum URLs
        return /^https?:\/\/.*(\.(jpg|jpeg|png|gif|webp)($|\?)|picsum\.photos)/i.test(v);
      },
      message: 'Thumbnail must be a valid image URL'
    }
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    required: true,
    enum: ['All', 'Programming', 'Music', 'Gaming', 'Cooking', 'Travel', 'Sports', 'Education', 'Entertainment', 'News']
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for comment count
videoSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'video',
  count: true
});

const Video = mongoose.model('Video', videoSchema);
export default Video;