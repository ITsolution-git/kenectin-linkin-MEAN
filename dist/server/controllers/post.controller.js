'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _post = require('../models/post.model');

var _post2 = _interopRequireDefault(_post);

var _comment = require('../models/comment.model');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//---------------------Commenting APIS-------------------

function saveComment(req, res, next) {
    var user = req.user;
    var comment = new _comment2.default({
        author: req.user,
        content: req.body.content
    });
    comment.save().then(function (result) {
        _post2.default.get(req.body.post_id).then(function (post) {
            post.comments.push(comment);
            post.save().then(function (result) {
                res.json({
                    result: 0,
                    data: comment
                });
            }).catch(function (e) {
                return next(e);
            });
        }).catch(function (e) {
            return res.json({
                result: 1,
                data: e.message
            });
        });
    }).catch(function (e) {
        return res.json({
            result: 1,
            data: e.message
        });
    });
}

exports.default = {
    saveComment: saveComment
};
module.exports = exports['default'];
//# sourceMappingURL=post.controller.js.map
