import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from './user.model';
import Post from './post.model';

/**
 * User Schema
 */
const UserPostSchema = new mongoose.Schema({
  user: { 
  	type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
 	post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
 	},
  createdAt: {
    type: Date, 
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * @typedef User
 */
export default mongoose.model('UserPost', UserPostSchema);
