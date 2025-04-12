import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createComment,
  getVideoComments,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/video/:videoId', getVideoComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router;