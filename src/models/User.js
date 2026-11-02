import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name.'],
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      required: [true, 'Please enter your email.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      select: false
    }
  },
  { timestamps: true }
);

// Hash the password before saving. Never store a plain-text password.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Do not expose the password hash in JSON responses.
userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    delete returnedObject.__v;
    return returnedObject;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
