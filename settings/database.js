
var fs = require('fs');
var join = require('path').join;
var uri_util = require('mongodb-uri');
var config = require('../settings/config');

module.exports.configure = function(mongoose) {
	var connect = function () {
		var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } };
		var mongoose_uri = uri_util.formatMongoose(config.db_server.host);
		mongoose.connect(mongoose_uri);
	};
	connect();
	var db = mongoose.connection;
	db.on('error', console.log);
	db.on('disconnected',connect);

	fs.readdirSync(join(__dirname, '../models')).forEach(function (file) {
		if (~file.indexOf('.js')) require(join(__dirname, '../models', file));
	});
};