'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
.get(_user2.default.list);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
.get(_user2.default.get)

/** PUT /api/users/:userId - Update user */
.put(_user2.default.update)

/** DELETE /api/users/:userId - Delete user */
.delete(_user2.default.remove);

router.route('/:userId/basicinfo').put(_user2.default.updateBasicinfo);
router.route('/:userId/uploaduserimg').post(multipartyMiddleware, _user2.default.uploadUserimg);
router.route('/:userId/getPosts').get(_user2.default.getPosts);
router.route('/:userId/addPost').post(_user2.default.addPost);
router.route('/:userId/follow').post(_user2.default.followUser);
router.route('/:userId/disconnect').post(_user2.default.disconnectUser);
router.route('/:userId/feeds').get(_user2.default.myFeeds);
router.route('/likePost').post(_user2.default.likePost);
router.route('/dislikePost').post(_user2.default.dislikePost);
/** Load user when API with userId route parameter is hit */
router.param('userId', _user2.default.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=user.route.js.map
