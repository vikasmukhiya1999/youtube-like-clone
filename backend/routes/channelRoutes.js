import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createChannel,
  getChannel,
  updateChannel,
  toggleSubscription,
  getChannelVideos
} from '../controllers/channelController.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/:id', getChannel);
router.put('/:id', protect, updateChannel);
router.post('/:id/subscribe', protect, toggleSubscription);
router.get('/:id/videos', getChannelVideos);

export default router;