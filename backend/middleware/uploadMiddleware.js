// Mock middleware for handling uploads (using external URLs instead of file uploads)
export const uploadVideo = (req, res, next) => {
  // Add mock video and thumbnail URLs to the request
  req.body.videoUrl = req.body.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  req.body.thumbnail = req.body.thumbnail || 'https://picsum.photos/1280/720';
  next();
};

export const uploadChannelImages = (req, res, next) => {
  // Add mock avatar and banner URLs to the request
  req.body.avatar = req.body.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${Date.now()}`;
  req.body.banner = req.body.banner || 'https://picsum.photos/1920/1080';
  next();
};