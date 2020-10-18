const express       = require('express');
const cookieParser  = require('cookie-parser');
const mongoose      = require('mongoose');
const http          = require('http');
const config        = require('./settings/config');
const models        = require('mongoose').models;
const passport      = require("passport");
const cors          = require('cors');
const oAuth2Server = require('node-oauth2-server');

const app = express();
app.use(cookieParser());

const server = http.createServer(app);

app.use('/uploads', express.static(__dirname + '/uploads'));

require('./settings/database').configure(mongoose);
require('./settings/express').configure(app);

const oAuthModel = require('./authorisation/accessTokenModel')();
app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
});
require('./authorisation/authRouter').configure(app);
app.use(app.oauth.errorHandler());

app.use(passport.initialize());
require('./settings/passport')(passport)
require('./settings/routes').configure(app);
app.use(cors());

const port = process.env.PORT || config.web_server.port || 3000;
console.log(port);
server.listen(port, function () {
    console.log('express running at: ' + port);
});


exports.module = exports = app; 