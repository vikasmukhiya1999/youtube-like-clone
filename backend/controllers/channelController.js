import Channel from '../models/Channel.js';
import User from '../models/User.js';

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name, description, avatar, banner } = req.body;
    const owner = req.user._id;

    // Check if user already has a channel with this name
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }

    // Validate avatar URL if provided
    if (avatar && !/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/.test(avatar)) {
      return res.status(400).json({ message: 'Invalid avatar URL' });
    }

    // Validate banner URL if provided
    if (banner && !/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/.test(banner)) {
      return res.status(400).json({ message: 'Invalid banner URL' });
    }

    const channel = await Channel.create({
      name,
      description,
      owner,
      avatar: avatar || 'https://api.dicebear.com/7.x/avatars/svg',
      banner: banner || 'https://picsum.photos/1920/1080'
    });

    // Add channel to user's channels
    await User.findByIdAndUpdate(owner, {
      $push: { channels: channel._id }
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get channel by ID
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username profilePicture')
      .populate({
        path: 'videos',
        select: 'title thumbnail views duration createdAt',
        options: { sort: { createdAt: -1 } }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update channel
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Subscribe/Unsubscribe to channel
export const toggleSubscription = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Prevent self-subscription
    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot subscribe to your own channel' });
    }

    const isSubscribed = channel.subscribers.includes(req.user._id);
    const updateOperation = isSubscribed ? '$pull' : '$push';
    const countAdjustment = isSubscribed ? -1 : 1;

    await Channel.findByIdAndUpdate(req.params.id, {
      [updateOperation]: { subscribers: req.user._id },
      $inc: { subscriberCount: countAdjustment }
    });

    // Update user's subscriptions
    await User.findByIdAndUpdate(req.user._id, {
      [updateOperation]: { subscribedTo: channel._id }
    });

    res.json({ 
      message: isSubscribed ? 'Unsubscribed' : 'Subscribed',
      isSubscribed: !isSubscribed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get channel videos
export const getChannelVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const videos = await Video.find({ channel: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('channel', 'name avatar');

    const count = await Video.countDocuments({ channel: req.params.id });

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};