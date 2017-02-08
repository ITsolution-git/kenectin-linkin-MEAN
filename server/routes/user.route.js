import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/:userId/basicinfo')
  .put(userCtrl.updateBasicinfo)
router.route('/:userId/uploaduserimg')
  .post(multipartyMiddleware,userCtrl.uploadUserimg)
router.route('/:userId/getPosts')
  .get(userCtrl.getPosts)
router.route('/:userId/addPost')
  .post(userCtrl.addPost)
  
/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
