import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new AppError('You are not logged in. Please log in first.', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Your session is invalid or has expired. Please log in again.', 401);
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The account for this session no longer exists.', 401);
  }

  req.user = currentUser;
  next();
});
