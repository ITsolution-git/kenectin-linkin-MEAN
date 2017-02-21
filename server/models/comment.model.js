
import mongoose from 'mongoose';
import User from './user.model';
/**
 * User Schema
 */
const CommentSchema = new mongoose.Schema({ 
	content: String,

  	author:  { type : mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Comment', CommentSchema);
