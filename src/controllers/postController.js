import mongoose from 'mongoose';
import Post from '../models/Post.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function validatePostId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('That post ID is not valid.', 400);
  }
}

// CREATE: POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new AppError('Both title and content are required.', 400);
  }

  const post = await Post.create({ title, content, author: req.user._id });
  res.status(201).json({ status: 'success', data: { post } });
});

// READ ALL: GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: { posts }
  });
});

// READ ONE: GET /api/posts/:id
export const getPost = asyncHandler(async (req, res) => {
  validatePostId(req.params.id);
  const post = await Post.findOne({ _id: req.params.id, author: req.user._id })
    .populate('author', 'name email');

  if (!post) throw new AppError('Post not found.', 404);
  res.status(200).json({ status: 'success', data: { post } });
});

// UPDATE: PATCH /api/posts/:id
export const updatePost = asyncHandler(async (req, res) => {
  validatePostId(req.params.id);
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.content !== undefined) updates.content = req.body.content;
  if (Object.keys(updates).length === 0) {
    throw new AppError('Send at least a title or content field to update.', 400);
  }

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, author: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  if (!post) throw new AppError('Post not found.', 404);
  res.status(200).json({ status: 'success', data: { post } });
});

// DELETE: DELETE /api/posts/:id
export const deletePost = asyncHandler(async (req, res) => {
  validatePostId(req.params.id);
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!post) throw new AppError('Post not found.', 404);

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully.',
    data: null
  });
});
