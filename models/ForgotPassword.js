var mongoose = require('mongoose');

var ForgotPassword = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String },
    createdAt: { type: Date, default: Date.now }
});

mongoose.model('ForgotPassword', ForgotPassword);