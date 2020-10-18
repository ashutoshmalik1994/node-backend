var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

module.exports.configure = function(app) {
    app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    
    var root = path.normalize(__dirname + './../');
    app.set('views', path.join(root, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(root, 'public')));


    app.use(express.static(__dirname + './../uploads/'));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
};