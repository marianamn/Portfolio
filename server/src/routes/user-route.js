const express = require('express');
const passport = require('passport');
const multer = require('multer');
const multerConfig = require('../config/multer');
let Router = express.Router;

module.exports = ({ app, controllers }) => {
    let router = new Router();
    let authorizedMiddleware = passport.authenticate('jwt', { 'session': false });

    router
        .get('/users', controllers.getAllUsers)
        .get('/users/:id', controllers.getUserById)
        .post('/register', controllers.register)
        .post('/login', controllers.login)
        .put('/users/:id', authorizedMiddleware, controllers.updateUser)
        .delete('/users/:id', authorizedMiddleware, controllers.deleteUser);

    app.use('/api', router);

    return router;
};