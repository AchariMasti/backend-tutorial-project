import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All post endpoints require a logged-in user.
router.use(protect);
router.route('/').post(createPost).get(getAllPosts);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

export default router;
