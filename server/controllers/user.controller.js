import User from '../models/user.model';
import Post from '../models/post.model';
import UserPost from '../models/users_posts.model';
import fs from 'fs';
import path from 'path';
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
	var user = JSON.parse(JSON.stringify(req.user));
	Post.count({
			userId: req.user._id
		}).exec()
		.then(postCount => {
			user.postCount = postCount;
			User.count({
					following: req.user._id
				}).exec()
				.then(followedByCount => {
					user.followedByCount = followedByCount;
					return res.json({
						data: user,
						result: 0
					});
				})
		})
		.catch(err => {
			return res.json({
				data: err,
				result: 1
			});
		})
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
		.then(savedUser => res.json({
			data: savedUser,
			result: 0
		}))
		.catch(e => next(e));
}


/**
 * Update basic info;firstname lastname profie.bio description title
 * @returns {User}
 */
function uploadUserimg(req, res, next) {
	var user = req.user;

	var file = req.files.file;

	fs.readFile(file.path, function(err, original_data) {
	if (err) {
		next(err);
	}
	// save image in db as base64 encoded - this limits the image size
	// to there should be size checks here and in client
	var newPath = path.join(__filename, '../../../../public/uploads/avatar/');
	fs.writeFile(newPath + user._id + path.extname(file.path), original_data, function(err) {
		if (err)
		next(err);
		console.log("write file" + newPath + user._id + path.extname(file.path));
		fs.unlink(file.path, function(err) {
		if (err) {
			console.log('failed to delete ' + file.path);
		} else {
			console.log('successfully deleted ' + file.path);
		}
		});
		user.image = '/uploads/avatar/' + user._id + path.extname(file.path);

		user.save(function(err) {
		if (err) {
			next(err);
		} else {
			res.json({
				data: user,
				result: 1
			});
		}
		});
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
 req.params.query : search string
 req.params.
 * @returns {User[]}
 */
function list(req, res, next) {
	var params = req.query;
	var condition;
	if (params.query == "")
		condition = {};
	else {
		condition = {
			$or: [{
				"firstname": new RegExp(params.query, 'i')
			}, {
				"lastname": new RegExp(params.query, 'i')
			}]
		};
	}
	User.count(condition).exec()
		.then(total => {
			if (params.page * params.item_per_page > total) {
				params.users = [];
				throw {
					data: params,
					result: 1
				};
			}
			params.total = total;
			return User.find(condition)
				.sort({
					createdAt: -1
				})
				.skip(params.page * params.item_per_page)
				.limit(parseInt(params.item_per_page))
				.exec();
		})
		.then(users => {
			params.users = users;
			res.json({
				data: params,
				result: 0
			});
		})
		.catch(err => next(err));
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
	Post.find({
			userId: user._id
		})
		.sort({
			createdAt: -1
		})
		
		.populate('userId')
		.populate({
			path: 'comments',
			// Get friends of friends - populate the 'friends' array for every friend
			populate: {
				path: 'author'
			}
		})
		.exec()
		.then(posts => {
			console.log(posts);
			res.json({
				data: posts,
				result: 0
			})
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
			res.json({
				data: post,
				result: 0
			})
		})
		.catch(e => next(e));
}

function followUser(req, res, next) {
	var user = req.user;
	User.get(req.body.user_follow_to)
		.then((user_follow_to) => {
			if (user.following.indexOf(user_follow_to._id) == -1)
				user.following.push(user_follow_to._id);
			user.save()
				.then(result => {
					res.json({
						result: 0,
						data: result
					});
				})
				.catch(e => next(e));
		})
		.catch(e => next(e));
}

function disconnectUser(req, res, next) {
	var user = req.user;
	User.get(req.body.user_disconnect_to)
		.then(user_disconnect_to => {
			var index = user.following.indexOf(user_disconnect_to._id)
			if (index > -1)
				user.following.splice(index, 1);
			user.save()
				.then(result => {
					res.json({
						result: 0,
						data: result
					});
				})
				.catch(e => next(e));
		})
		.catch(e => next(e));
}


function myFeeds(req, res, next) {
	var user = req.user;
	Post.find({
			userId: {
				$in: user.following
			}
		})
		.populate('userId')
		.populate({
			path: 'comments',
			// Get friends of friends - populate the 'friends' array for every friend
			populate: {
				path: 'author'
			}
		})
		// .populate('likeUsers')
		.exec()
		.then(feeds => {
			res.json({
				data: feeds,
				result: 0
			});
		})
		.catch(e => next(e));
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
//----------------------Like system----------------

function likePost(req, res, next) {
	// UserPost.find({
	// 	user: req.current_user,
	// 	post: req.body.post_id
	// })
	// .exec()
	// .then(userpost => {
	// 	if(userpost.length == 0){
	// 		new UserPost({
	// 			user: req.current_user,
	// 			post: req.body.post_id
	// 		}).save().then((userpost)=>{
	// 			res.json({
	// 				result:0,
	// 				data:userpost
	// 			});
	// 		})
	// 	}
	// 	else
	// 	{
	// 		res.json({
	// 			result:0,
	// 			data:"You already like it"
	// 		})
	// 	}
	// })
	// .catch(e => {
	// 	res.json({
	// 		result: 1,
	// 		data: e
	// 	})
	// });

	Post.get(req.body.post_id)
		.then((post) => {
			if (post.likeUsers.indexOf(req.current_user._id) == -1)
				post.likeUsers.push(req.current_user._id);
			post.save()
				.then(result => {
					res.json({
						result: 0,
						data: result
					});
				})
				.catch(e => next(e));
		})
		.catch(e => next(e));
}


function dislikePost(req, res, next) {
	// UserPost.remove({
	// 	user: req.current_user,
	// 	post: req.body.post_id
	// })
	// .exec()
	// .then(userpost => {
	// 	res.json({
	// 		result:0,
	// 		data:userpost
	// 	})
	// })
	// .catch(e => {
	// 	res.json({
	// 		result: 1,
	// 		data: e.message
	// 	})
	// });

	Post.get(req.body.post_id)
		.then((post) => {
			if (post.likeUsers.indexOf(req.current_user._id) != -1)
				post.likeUsers.splice(post.likeUsers.indexOf(req.current_user._id), 1);
			post.save()
				.then(result => {
					res.json({
						result: 0,
						data: result
					});
				})
				.catch(e => next(e));
		})
		.catch(e => next(e));
}

export default {
	load,
	get,
	create,
	update,
	list,
	remove,
	updateBasicinfo,
	uploadUserimg,
	getPosts,
	addPost,
	followUser,
	disconnectUser,
	myFeeds,
	likePost,
	dislikePost
};