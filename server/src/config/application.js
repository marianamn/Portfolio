const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


module.exports = () => {
    let app = express();

    // Body Parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ 'extended': true }));

    // Passport Middleware
    app.use(passport.initialize());
    app.use(passport.session());
    require('./passport')(passport);

    return app;
};