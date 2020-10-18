var mongoose = require('mongoose');

var Product = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

Product.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

mongoose.model('Product', Product);