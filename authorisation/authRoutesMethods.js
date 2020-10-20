"use strict";

const models = require('mongoose').models;
const async = require('async');
const response_helper = require('../helpers/response');
const userValidate = require('../validators/user');
const bcrypt = require('bcrypt-nodejs');
const request = require('request');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ashutoshmalik.am@gmail.com',
        pass: '8950603035'
    }
});
/************** User Registration API Start *************/

exports.registerUser = (req, res) => {
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
        },
        (saveData, cb) => {
            models.VerifyEmail.create({ userId: saveData._id, token: crypto.randomBytes(16).toString('hex') }, (err, data) => {
                console.log(data);
                if(err) cb(err);
                const msg = {
                    to: req.body.email,
                    from: 'noreply@jupita.io',
                    subject: 'Verify your email address',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<h1>Welcome</h1><p>Please verify your email address by clicking on this link http://localhost:4200/confirmation/'+data.token+'</p>',
                };
                sgMail
                .send(msg, (err, info) => {
                    (err) ? cb(err) : cb(null, saveData);
                });
            });
        }
    ], (error, data) => {
        const response = response_helper(res);
        return (error) ? response.failure(error, 409) : response.data({ 'is_success': true, 'data': data }, 200);
    });
}

exports.verifyEmail = (req, res) => {
    async.waterfall([
        (cb) => {
            models.VerifyEmail.findOne({token: req.body.id}, (err, data) => {
                if(err) cb(err);
                if(data == null) {
                    cb('This link is not exist');
                } else {
                    models.User.findOneAndUpdate({_id: data.userId}, {status: true}, (err, userData) => {
                        if(err) cb(err);
                        models.VerifyEmail.findOneAndDelete({_id: data._id}, (err, deleted) => {
                            if(err) cb(err);
                            cb(null, 'success');
                        })
                    });
                }
            })
        }
    ], (error, data) => {
        const response = response_helper(res);
        return (error) ? response.failure(error, 409) : response.data({ 'is_success': true, 'data': data }, 200);
    });
}

/************** User Registration API End *************/

exports.checkAuthorisation = (req, res) => {
    const response = response_helper(res);
    return response.data({ 'is_success': true, 'data': req.user }, 200);
}

/********** function for generate token of product *************/

function newProductToken (data, callback) {
    const postCurlRequestData = {
        url: 'http://localhost:3000/auth/refresh-token-for-product',
        form: {
            username: data.userId+"/"+data.id,
            password: data.password,
            grant_type: "password",
            client_id: 'null',
            client_secret: 'null'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': data.header
        }
    }
    request.post(postCurlRequestData, (err, res) => {
        if (err) return callback(err);
        const curlResponse = JSON.parse(res.body);
        if (!curlResponse.token_type) return callback("error");
        if (curlResponse.token_type === 'bearer') return callback(null, {access_token: curlResponse.access_token});
    });
}

/********** function generate token of product ends**********/

/************** Product Registration API **************/

exports.registerProduct = (req, res) => {
    console.log(req.user.id);
    console.log('req.body', req.body, req.headers.authorization);
    async.waterfall([
        (cb) => {
            models.Product.findOne({productName: req.body.productName, userId: req.user.id}, (err, productData) => {
                if (err) cb(err)
                if (!productData) {
                    models.Product.create({productName: req.body.productName, userId: req.user.id}, (err, savedProductData) => {
                        if (err) cb(err);
                        cb(null, savedProductData);
                    });
                } else {
                    cb("Product already exist");
                }
            })
        },
        (savedProductData, cb) => {
            const curlFormAndHeader = {
                id: savedProductData._id,
                password: 'pu3bli6ct9ok1en4fo7rp0yt2ho5nm8od*al#ap!i',
                userId: savedProductData.userId,
                header: req.headers.authorization
            }
            newProductToken(curlFormAndHeader, (err, updatedToken) => {
                if(err) cb (err);
                savedProductData['accessToken'] = updatedToken.access_token;
                cb(null, savedProductData);
            });
        },
        (productDetails, cb) => {
            const curlFormAndHeader = {
                id: productDetails._id,
                password: 'p1yt2ho5nm4od6al7pr0ivatet%ok#en',
                userId: productDetails.userId,
                header: req.headers.authorization
            }
            newProductToken(curlFormAndHeader, (err, updatedToken) => {
                if(err) cb (err);
                const response = {
                    productName: productDetails.productName,
                    accessToken: productDetails.accessToken
                }
                cb(null, response);
            });
        }
    ], (error, data) => {
        const response = response_helper(res);
        return (error) ? response.failure(error, 409) : response.data({ 'is_success': true, 'data': data }, 200);
    });
}

/************** Product Registration API End***********/


module.exports.refreshProductToken = (req, res) => {
    async.waterfall([
        (cb) => {
            models.Product.findOne({_id: req.user.id}, (err, productData) => {
                if (err) cb(err);
                if (!productData) {
                    cb('Product does not exist');
                } else {
                    cb(null, productData);
                }
            })
        },
        (productData, cb) => {
            const curlFormAndHeader = {
                id: productData._id,
                password: 'pu3bli6ct9ok1en4fo7rp0yt2ho5nm8od*al#ap!i',
                userId: productData.userId,
                header: req.headers.authorization
            }
            newProductToken(curlFormAndHeader, (err, updatedToken) => {
                if(err) cb (err);
                cb(null, updatedToken);
            });
        }
    ], (error, data) => {
        const response = response_helper(res);
        return (error) ? response.failure(error, 409) : response.data({ 'is_success': true, 'data': data }, 200);
    });
}
/************** API for Refreshing Product Token Ends******/