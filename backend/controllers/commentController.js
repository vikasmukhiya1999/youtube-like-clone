import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content, videoId, parentCommentId } = req.body;
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await Comment.create({
      content,
      user: req.user._id,
      video: videoId,
      parentComment: parentCommentId || null
    });

    // If it's a reply, add it to parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    await comment.populate('user', 'username profilePicture');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comments for a video
export const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ 
      video: videoId,
      parentComment: null // Only get top-level comments
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username profilePicture' }
      });

    const count = await Comment.countDocuments({ 
      video: videoId,
      parentComment: null
    });

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If it's a parent comment, delete all replies
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    } else {
      // If it's a reply, remove it from parent's replies array
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/Unlike comment
export const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(req.user._id);
    const updateOperation = isLiked ? '$pull' : '$push';

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { [updateOperation]: { likes: req.user._id } },
      { new: true }
    );

    res.json({
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      likes: updatedComment.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();

    // Re-populate user info before sending response
    await comment.populate('user', 'username profilePicture');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};