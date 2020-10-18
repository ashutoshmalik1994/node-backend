const user_controller = require('../controllers/users');
const passport = require('passport');




module.exports.configure = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    /*=====================user Start==============================*/

    app.post('/api/user/createUser', user_controller.createUser);
    
    /*=====================user End==============================*/
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}