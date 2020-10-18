const models = require('mongoose').models;
const jwtStatergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const settings = require('../settings/config');

module.exports = passport => {
    const opts = {};    
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = settings.auth.secret;
    passport.use(
        new jwtStatergy(opts, (jwt_payload, done) => {
            models.User.findOne({_id: jwt_payload.id}, function(err, user) {
                if (err) return done(err, false);
                if (!user)  return done(null, false);
                return done(null, {_id:user._id,userName:user.userName,email:user.email});
            });
        })
    )
}