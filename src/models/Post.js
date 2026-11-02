import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.'],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    content: {
      type: String,
      required: [true, 'Post content is required.'],
      trim: true,
      minlength: 1,
      maxlength: 10000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
