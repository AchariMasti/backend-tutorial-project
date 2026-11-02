import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  };
}

function createLoginCookie(user, res) {
  const token = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required.', 400);
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError('An account with this email already exists. Please log in.', 409);
  }

  const user = await User.create({ name, email: normalizedEmail, password });
  createLoginCookie(user, res);

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully.',
    data: { user }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  const passwordIsCorrect = user && await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    throw new AppError('Incorrect email or password.', 401);
  }

  createLoginCookie(user, res);
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully.',
    data: { user: user.toJSON() }
  });
});

export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
};

export const getMe = (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
};
