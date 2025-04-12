import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import Comment from '../models/Comment.js';

// Create a new video
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category, duration } = req.body;
    
    // Validate YouTube URL
    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*/;
    if (!youtubeUrlPattern.test(videoUrl)) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    // Validate thumbnail URL
    const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/;
    if (!imageUrlPattern.test(thumbnail)) {
      return res.status(400).json({ message: 'Invalid thumbnail URL' });
    }

    // Get user's channel
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found. Create a channel first.' });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail,
      category,
      duration,
      channel: channel._id
    });

    // Add video to channel's videos
    await Channel.findByIdAndUpdate(channel._id, {
      $push: { videos: video._id },
      $inc: { videoCount: 1 }
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get video by ID
export const getVideo = async (req, res) => {
  try {
    // Find video and populate necessary fields
    const video = await Video.findById(req.params.id)
      .populate({
        path: 'channel',
        select: 'name avatar subscriberCount',
        populate: {
          path: 'owner',
          select: 'username profilePicture'
        }
      });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ video: video._id });

    // Add current user info to response
    const videoObj = video.toObject();
    videoObj.commentCount = commentCount;
    videoObj.currentUser = req.user ? req.user._id : null;

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(videoObj);
  } catch (error) {
    console.error('Error in getVideo:', error);
    res.status(500).json({ 
      message: 'Error fetching video', 
      error: error.message 
    });
  }
};

// Update video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user owns the channel that owns this video
    const channel = await Channel.findById(video.channel);
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user owns the channel that owns this video
    const channel = await Channel.findById(video.channel);
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete video and all its comments
    await Comment.deleteMany({ video: video._id });
    await Video.findByIdAndDelete(req.params.id);
    
    // Update channel's video count
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
      $inc: { videoCount: -1 }
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/Unlike video
export const toggleVideoLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const isLiked = video.likes.includes(req.user._id);
    const updateOperation = isLiked ? '$pull' : '$push';

    // If user has disliked the video, remove the dislike
    if (!isLiked && video.dislikes.includes(req.user._id)) {
      video.dislikes.pull(req.user._id);
    }

    // Update likes
    video[isLiked ? 'likes' : 'dislikes'].pull(req.user._id);
    video[!isLiked ? 'likes' : 'dislikes'].push(req.user._id);
    await video.save();

    res.json({
      message: isLiked ? 'Video unliked' : 'Video liked',
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle video dislike
export const toggleVideoDislike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const isDisliked = video.dislikes.includes(req.user._id);
    
    // If user has liked the video, remove the like
    if (!isDisliked && video.likes.includes(req.user._id)) {
      video.likes.pull(req.user._id);
    }

    // Toggle dislike
    if (isDisliked) {
      video.dislikes.pull(req.user._id);
    } else {
      video.dislikes.push(req.user._id);
    }
    await video.save();

    res.json({
      message: isDisliked ? 'Video undisliked' : 'Video disliked',
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    console.error('Error in toggleVideoDislike:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get videos by category or search
export const getVideos = async (req, res) => {
  try {
    const { 
      category,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const videos = await Video.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('channel', 'name avatar');

    const count = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};