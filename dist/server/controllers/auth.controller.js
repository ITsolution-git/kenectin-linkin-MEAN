'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../config/env');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    console.log(req.body);
    _user2.default.find({
        'email': req.body.email
    }).then(function (users) {
        if (users.length == 1) {
            var user = users[0];
            if (user.password == req.body.password) {
                var token = _jsonwebtoken2.default.sign({
                    username: user.username,
                    email: user.email
                }, config.jwtSecret, {
                    expiresIn: 60 * 60 * 24 * 30
                });
                res.json({
                    data: {
                        userinfo: {
                            _id: user._id
                        },
                        token: token
                    },
                    result: 0
                });
            } else {
                res.json({
                    data: "Wrong password",
                    result: 1
                });
            }
        } else {
            return res.json({
                data: "No Email address",
                result: 1
            });
        }
    }).catch(function (err) {
        return next(err);
    });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

function signup(req, res, next) {
    _user2.default.find({ 'username': req.body.username }).then(function (user) {
        if (user.length != 0) res.json({ data: "Username exists. Choose another one", result: 1 });else {
            var user = new _user2.default({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
                email: req.body.email
            });
            user.save(function (err) {
                if (err) res.json({ data: err, result: 1 });else {
                    res.json({ data: user, result: 0 });
                    console.log('User saved successfully!');
                }
            });
        }
    });
}

exports.default = { login: login, getRandomNumber: getRandomNumber, signup: signup };
module.exports = exports['default'];
//# sourceMappingURL=auth.controller.js.map
