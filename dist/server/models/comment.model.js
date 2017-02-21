'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var CommentSchema = new _mongoose2.default.Schema({
  content: String,

  author: { type: _mongoose2.default.Schema.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exports.default = _mongoose2.default.model('Comment', CommentSchema);
module.exports = exports['default'];
//# sourceMappingURL=comment.model.js.map
