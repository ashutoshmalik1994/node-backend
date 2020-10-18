var mongoose = require('mongoose');

var BearerTokenHelper = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    accessToken: { type: String, default: '' },
    tokenType: { type: String, default: 'private' },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

BearerTokenHelper.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

var hourFromNow = function(){
    return moment().add(1, 'hour');
};

mongoose.model('BearerTokenHelper', BearerTokenHelper);