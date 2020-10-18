const authRoutesMethods = require('./authRoutesMethods');
module.exports.configure = (app) => {

    /* This is the route client's will call to register new users. It's very aptly named. */
    app.post('/auth/registerUser', authRoutesMethods.registerUser);
    app.post('/auth/verifyEmail', authRoutesMethods.verifyEmail);
    app.post('/auth/checkAuthorisation', app.oauth.authorise(), authRoutesMethods.checkAuthorisation);
    app.post('/auth/register-product', app.oauth.authorise(), authRoutesMethods.registerProduct);
    app.post('/auth/refresh-product-token', app.oauth.authorise(), authRoutesMethods.refreshProductToken);

    /* This is the route for allowing existing users to login using a username and
    passsword. If they successfully login this method will returns the bearer token
    they need to access auth protected areas. the grant() method we pass in as
    middleware below will handle sending the bearer token back to the client as
    long as we validate their username and password properly using the mode we'll
    implement later in this tutorial. */
    app.post('/auth/generate-token-for-product', app.oauth.grant());
    app.post('/auth/refresh-token-for-product', app.oauth.grant());
    app.post('/auth/refresh-token', app.oauth.grant());
    app.post('/auth/login', app.oauth.grant());
}