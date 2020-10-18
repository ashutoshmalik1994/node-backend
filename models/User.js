var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var User = mongoose.Schema({
    userName: { type: String, default: '', trim: true},
    email: { type: String, default: '', trim: true },
    password: { type: String, default: '' },
    role: { type: String, default: '', trim: true },
    status: { type: Boolean, default: true },
    token: {type: String, default: ''},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

User.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


mongoose.model('User', User);