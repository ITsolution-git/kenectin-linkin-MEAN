import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';

const config = require('../../config/env');


/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    User.find({
            'email': req.body.email
        })
        .then(users => {
            if (users.length == 1) {
                let user = users[0];
                if (user.password == req.body.password) {
                    const token = jwt.sign({
                        id: user._id
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
        })
        .catch(err => next(err));
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
  User.find({'username':req.body.username})
    .then(user=>{
      if(user.length!=0)
        res.json({data:"Username exists. Choose another one", result:1})
      else
      {
        var user = new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          email: req.body.email,
        });
        user.save(function(err) {
          if (err) 
            res.json({data:err, result:1});
          else{
            res.json({data:user, result:0});
            console.log('User saved successfully!');
          }
        });
      }
    });
}


export default { login, getRandomNumber, signup};
