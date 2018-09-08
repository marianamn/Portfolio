const express = require('express');
const passport = require('passport');
const multer = require('multer');
const multerConfig = require('../config/multer');
let Router = express.Router;

module.exports = ({ app, controllers }) => {
    let router = new Router();
    let storagePlace = '../image-uploads/user-avatars/';
    let storage = multerConfig.setFilesStoragePlace(storagePlace);

    let authorizedMiddleware = passport.authenticate('jwt', { 'session': false });
    let imageUploadMiddleware = multer({ storage }).single('avatar');

    router
        .get('/users', controllers.getAllUsers)
        .get('/users/:id', controllers.getUserById)
        .get('/profile', authorizedMiddleware, controllers.profile)
        .post('/register', imageUploadMiddleware, controllers.register)
        .post('/login', controllers.login)
        .put('/profile-update', authorizedMiddleware, imageUploadMiddleware, controllers.updateUser)
        .delete('/users/:id', authorizedMiddleware, controllers.deleteUser);

    app.use('/api', router);

    return router;
};