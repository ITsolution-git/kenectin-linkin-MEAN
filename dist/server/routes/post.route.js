'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _post = require('../controllers/post.controller');

var _post2 = _interopRequireDefault(_post);

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/:userId/saveComment').post(_post2.default.saveComment);

// router.route('/signup')
//   .post(postCtrl.signup);

/** Load user when API with userId route parameter is hit */
router.param('userId', _user2.default.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=post.route.js.map
