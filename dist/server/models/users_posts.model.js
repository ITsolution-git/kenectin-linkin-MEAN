'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _post = require('./post.model');

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var UserPostSchema = new _mongoose2.default.Schema({
  user: {
    type: _mongoose2.default.Schema.ObjectId,
    ref: 'User'
  },
  post: {
    type: _mongoose2.default.Schema.ObjectId,
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
exports.default = _mongoose2.default.model('UserPost', UserPostSchema);
module.exports = exports['default'];
//# sourceMappingURL=users_posts.model.js.map
