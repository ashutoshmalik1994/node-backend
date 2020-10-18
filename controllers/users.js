"use strict";

const models = require('mongoose').models;
const async = require('async');
const response_helper = require('../helpers/response');
const authentication = require('../middleware/authentication');
const userValidate = require('../validators/user');
const bcrypt = require('bcrypt-nodejs');


/************** User Registration API Start *************/

exports.createUser = (req, res) => {
    // console.log(req.body);
    async.waterfall([
        (cb) => {
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
            userValidate.userForm(req.body).is_valid((err, validData) => {
                (err) ? cb(err) : cb(null, validData.data)
            })
        },
        (saveData, cb) => {
            models.User.findOne({ 'email': req.body.email }, (err, data) => {
                (err) ? cb(err) : (data == null) ? cb(null, 'usernameCheck') : cb('This email is already exist')
            });
        },
        (saveData, cb) => {
            req.body['role'] = 'super user';
            req.body["status"] = false;
            models.User.create(req.body, (err, savedData) => {
                (err) ? cb(err) : cb(null, savedData)
            })
        }
    ], (error, data) => {
        var response = response_helper(res);
        return (error) ? response.failure(error, 409) : response.data({ 'is_success': true, 'data': data }, 200);
    });
}

/************** User Registration API End *************/