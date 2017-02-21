import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import postCtrl from '../controllers/post.controller';
import userCtrl from '../controllers/user.controller';
import config from '../../config/env';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/:userId/saveComment')
  .post(postCtrl.saveComment);

// router.route('/signup')
//   .post(postCtrl.signup);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;