import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { AppError } from './utils/AppError.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend Tutorial API is running.',
    endpoints: ['/api/auth', '/api/posts']
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl}.`, 404));
});

// Central error handler. It keeps API errors in a consistent JSON format.
app.use((err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong.';

  if (err.code === 11000) {
    statusCode = 409;
    message = 'That email address is already registered.';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((item) => item.message).join(' ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'The supplied ID or value is invalid.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message
  });
});

export default app;
