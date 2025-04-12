import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  toggleVideoLike,
  toggleVideoDislike,
  getVideos
} from '../controllers/videoController.js';

const router = express.Router();

router.post('/', protect, createVideo);
router.get('/search', getVideos);
router.get('/:id', getVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, toggleVideoLike);
router.post('/:id/dislike', protect, toggleVideoDislike);

export default router;