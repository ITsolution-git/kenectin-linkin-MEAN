'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _post = require('../models/post.model');

var _post2 = _interopRequireDefault(_post);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  _user2.default.get(id).then(function (user) {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  req.user.password = "";

  return res.json({ data: req.user, result: 0 });
}

/**
 * Update basic info;firstname lastname profie.bio description title
 * @returns {User}
 */
function updateBasicinfo(req, res, next) {
  var user = req.user;
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.profile.bio = req.body.profile.bio;
  user.profile.title = req.body.profile.title;
  user.profile.description = req.body.profile.description;

  user.save().then(function (savedUser) {
    return res.json({ data: savedUser, result: 0 });
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Update basic info;firstname lastname profie.bio description title
 * @returns {User}
 */
function uploadUserimg(req, res, next) {
  var user = req.user;

  var file = req.files.file;

  _fs2.default.readFile(file.path, function (err, original_data) {
    if (err) {
      next(err);
    }
    // save image in db as base64 encoded - this limits the image size
    // to there should be size checks here and in client
    var base64Image = original_data.toString('base64');
    _fs2.default.unlink(file.path, function (err) {
      if (err) {
        console.log('failed to delete ' + file.path);
      } else {
        console.log('successfully deleted ' + file.path);
      }
    });
    user.image = base64Image;

    user.save(function (err) {
      if (err) {
        next(err);
      } else {
        res.json({ data: user, ressult: 1 });
      }
    });
  });
}
/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  var user = new _user2.default({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber
  });

  user.save().then(function (savedUser) {
    return res.json(savedUser);
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  var user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.save().then(function (savedUser) {
    return res.json(savedUser);
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get user list.
 req.params.query : search string
 req.params.
 * @returns {User[]}
 */
function list(req, res, next) {
  var params = req.query;
  var condition;
  if (params.query == "") condition = {};else {
    condition = { $or: [{ "firstname": new RegExp(params.query, 'i') }, { "lastname": new RegExp(params.query, 'i') }] };
  }
  console.log(params);
  _user2.default.count(condition).exec().then(function (total) {
    if (params.page * params.item_per_page > total) {
      params.users = [];
      throw { data: params, result: 1 };
    }
    params.total = total;
    return _user2.default.find(condition).sort({ createdAt: -1 }).skip(params.page * params.item_per_page).limit(parseInt(params.item_per_page)).exec();
  }).then(function (users) {
    params.users = users;
    res.json({ data: params, result: 0 });
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  var user = req.user;
  user.remove().then(function (deletedUser) {
    return res.json(deletedUser);
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * get post of ther user
 * @returns {User}
 */
function getPosts(req, res, next) {
  var user = req.user;
  _post2.default.find({ userId: user._id }).sort({ createdAt: -1 }).exec().then(function (posts) {
    console.log(posts);
    res.json({ data: posts, result: 0 });
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * get post of ther user
 * @returns {User}
 */
function addPost(req, res, next) {
  var user = req.user;
  var post = new _post2.default({
    userId: user._id,
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(function (post) {
    console.log(post);
    res.json({ data: post, result: 0 });
  }).catch(function (e) {
    return next(e);
  });
}

function followUser(req, res, next) {
  var user = req.user;
  _user2.default.get(req.body.user_follow_to).then(function (user_follow_to) {
    if (user.following.indexOf(user_follow_to._id) == -1) user.following.push(user_follow_to._id);
    user.save().then(function (result) {
      res.json({ result: 0, data: result });
    }).catch(function (e) {
      return next(e);
    });
  }).catch(function (e) {
    return next(e);
  });
}

function disconnectUser(req, res, next) {
  var user = req.user;
  _user2.default.get(req.body.user_disconnect_to).then(function (user_disconnect_to) {
    var index = user.following.indexOf(user_disconnect_to._id);
    if (index > -1) user.following.splice(index, 1);
    user.save().then(function (result) {
      res.json({ result: 0, data: result });
    }).catch(function (e) {
      return next(e);
    });
  }).catch(function (e) {
    return next(e);
  });
}

function myFeeds(req, res, next) {
  var user = req.user;
  _post2.default.find({ userId: { $in: user.following } }).populate('userId').exec().then(function (feeds) {
    res.json({ data: feeds, result: 0 });
  }).catch(function (e) {
    return next(e);
  });
}

// function allUsers(req, res, next) {
//   var user = req.user;
//   User.find()
//     .sort({ createdAt: -1 })
//     .exec()
//     .then(users => {
//       res.json(users)
//     })
//     .catch(e => next(e));
// }

exports.default = { load: load, get: get, create: create, update: update, list: list, remove: remove,
  updateBasicinfo: updateBasicinfo, uploadUserimg: uploadUserimg, getPosts: getPosts, addPost: addPost,
  followUser: followUser, disconnectUser: disconnectUser, myFeeds: myFeeds };
module.exports = exports['default'];
//# sourceMappingURL=user.controller.js.map
