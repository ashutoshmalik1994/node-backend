const models = require('mongoose').models;
const async = require('async');
var moment = require('moment');

module.exports =  () => {

    userDBHelper = models.User;

    accessTokensDBHelper = models.BearerTokenHelper;

    productModel = models.Product;

    return  {

        getClient: getClient,

        grantTypeAllowed: grantTypeAllowed,

        getUser: getUser,

        saveAccessToken: saveAccessToken,

        getAccessToken: getAccessToken
    }
}

function getClient(clientID, clientSecret, callback){
    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null
    }

    callback(false, client);
}

function grantTypeAllowed(clientID, grantType, callback) {

    callback(false, true);
}

function getUser(username, password, callback){
    if(password === 'p1yt2ho5nm4od6al7pr0ivatet%ok#en' || password === 'pu3bli6ct9ok1en4fo7rp0yt2ho5nm8od*al#ap!i') {
        const userAndProductID = username.split('/');
        userDBHelper.findOne({ '_id': userAndProductID[0] }, (err, user) => {
            if (err) return callback(err, null);
            if (password === 'pu3bli6ct9ok1en4fo7rp0yt2ho5nm8od*al#ap!i') {
                user['public'] = 'public';
            }
            user['productID'] = userAndProductID[1];
            return callback(false, user);
        });
    } else {
        console.log(username, password)
        userDBHelper.findOne({ 'email': username }, (err, user) => {
            if(err) return callback(err, null);
            console.log(user);
            if(user == null){
                return callback('Invalid Credentials!')
            }
            if (user.validPassword(password)) {
                return callback(false, user);
            } else {
                return callback(err, null);
            }
        });
    }
}

function saveAccessToken(accessToken, clientID, expires, user, callback){
    const expiresAt = moment().add(1, 'hour');
    if(!user.productID){
        accessTokensDBHelper.findOne({userId: user.id}, (err, data) => {
            if(!data){
                accessTokensDBHelper.create({accessToken: accessToken, userId: user.id, expiresAt: expiresAt}, (err, data) => {
                    if(err) return callback(err);
                    return callback(null)
                });
            }else{
                data.accessToken = accessToken;
                data.expiresAt = expiresAt;
                data.save((err, updatedUser) => {
                    if(err) return callback(err);
                    return callback(null);
                });
            }
        });
    } else {
        if (user.public) {
            const expiresAtPublicTime = moment().add(9999, 'year');
            accessTokensDBHelper.findOne({productID: user.productID, tokenType: 'public'}, (err, data) => {
                if(!data){
                    accessTokensDBHelper.create({accessToken: accessToken, userId: user.id, productID: user.productID, expiresAt: expiresAtPublicTime, tokenType: 'public'}, (err, data) => {
                        if(err) return callback(err);
                        return callback(null)
                    });
                }else{
                    data.accessToken = accessToken;
                    data.expiresAt = expiresAtPublicTime;
                    data.save((err, updatedUser) => {
                        if(err) return callback(err);
                        return callback(null)
                    });
                }
            });
        } else {
            accessTokensDBHelper.findOne({productID: user.productID, tokenType: 'private'}, (err, data) => {
                if(!data){
                    accessTokensDBHelper.create({accessToken: accessToken, userId: user.id, productID: user.productID, expiresAt: expiresAt, tokenType: 'private'}, (err, data) => {
                        if(err) return callback(err);
                        return callback(null)
                    });
                }else{
                    data.accessToken = accessToken;
                    data.expiresAt = expiresAt;
                    data.save((err, updatedUser) => {
                        if(err) return callback(err);
                        return callback(null)
                    });
                }
            });
        }
    }
}

function getAccessToken(bearerToken, callback) {
    accessTokensDBHelper.findOne({accessToken: bearerToken})
        .then(userID => createAccessTokenFrom(userID.userId, userID.expiresAt, userID.tokenType, userID.productID))
        .then(accessToken => callback(null, accessToken))
        .catch(error => callback(error , null));
}

function createAccessTokenFrom(userId, expiresAt, tokenType, productID) {
    if (tokenType == 'public') {
        return Promise.resolve({
            user: {
                id: productID,
            },
            expires: expiresAt
        });
    } else {
        return Promise.resolve({
            user: {
                id: userId,
            },
            expires: expiresAt
        });
    }
}