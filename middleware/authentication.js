"use strict";

const jwt = require('jsonwebtoken');
const config = require('../settings/config');

exports.getToken = function(user) {
    var claims = {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.userName,
        profilePic: user.profilePic,
        braintreeCustomerId: user.braintreeCustomerId,
        trainerId: user.trainerId,
        favoriteTrainer: user.favoriteTrainer
    }
    user.token = jwt.sign(claims, config.auth.secret, { expiresIn: '1h' });
    return user.token
};

exports.requireLogin = function(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/login');
};