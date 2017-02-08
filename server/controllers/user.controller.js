import User from '../models/user.model';
import Post from '../models/post.model';
import fs from 'fs';
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  req.user.password = "";
  return res.json({data:req.user, result:0});
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

  user.save()
    .then(savedUser => res.json({data:savedUser,result:0}))
    .catch(e => next(e));
}


/**
 * Update basic info;firstname lastname profie.bio description title
 * @returns {User}
 */
function uploadUserimg(req, res, next) {
  var user = req.user;

  var file = req.files.file;

  fs.readFile(file.path, function (err,original_data) {
    if (err) {
      next(err);
    } 
      // save image in db as base64 encoded - this limits the image size
      // to there should be size checks here and in client
    var base64Image = original_data.toString('base64');
    fs.unlink(file.path, function (err) {
      if (err)
      { 
        console.log('failed to delete ' + file.path);
      }
      else{
        console.log('successfully deleted ' + file.path);
      }
    });
    user.image = base64Image;

    user.save(function(err) {
      if (err) {
        next(err);
      } else {
        res.json({data:user, ressult:1});
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
  const user = new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}


/**
 * get post of ther user
 * @returns {User}
 */
function getPosts(req, res, next) {
  var user = req.user;
  Post.find({userId:user._id})
      .sort({ createdAt: -1 })
      .exec()
      .then(posts => {
        console.log(posts);
        res.json({data:posts, result:0})
      })
      .catch(e => next(e));
}

/**
 * get post of ther user
 * @returns {User}
 */
function addPost(req, res, next) {
  var user = req.user;
  var post = new Post({
        userId: user._id,
        title: req.body.title,
        content: req.body.content,
      });
  post.save()
    .then(post => {
      console.log(post);
      res.json({data:post, result:0})
    })
    .catch(e => next(e));
}


export default { load, get, create, update, list, remove, updateBasicinfo, uploadUserimg, getPosts, addPost};
