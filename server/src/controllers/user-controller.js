const config = require('../config/index');
const jwt = require('jsonwebtoken');
const constants = require('../common/constants');
const getMessage = require('../common/messages');
const utilsFunctions = require('../utils/utils');

module.exports = (params) => {
    let { data } = params;
    let message = getMessage('User');

    return {
        register(req, res) {
            let newUser = req.body;
            let avatarInfo = utilsFunctions.getRequestFileInfo(req.file);

            utilsFunctions.isRequestEmpty(newUser);

            data.register(newUser, avatarInfo)
                .then(() => {
                    res.status(constants.statusCodeCreated).send({
                        'success': true,
                        'message': message.registered
                    });
                })
                .catch((err) => {
                    let errorMessage = err.message;

                    res.status(constants.statusCodeBadRequest).send({
                        'success': false,
                        'message': message.notRegistered,
                        errorMessage
                    });
                });
        },
        login(req, res) {
            let user = req.body;

            utilsFunctions.isRequestEmpty(user);

            data.login(user)
                .then((result) => {
                    if (result === 'user not found') {
                        throw Error('User not found');
                    }

                    if (result.isMatch) {
                        const token = jwt.sign(result.user, config.secret, {
                            'expiresIn': constants.tokenExpiresIn
                        });

                        res.status(constants.statusCodeCreated).send({
                            'success': true,
                            'message': message.loggedIn,
                            'token': `JWT ${token}`,
                            'user': result.user
                        });
                    } else {
                        res.json({
                            'success': false,
                            'message': 'Wrong password'
                        });
                    }
                })
                .catch((err) => {
                    let errorMessage = err.message;

                    res.status(constants.statusCodeBadRequest).send({
                        'success': false,
                        'message': message.notLoggedIn,
                        errorMessage
                    });
                });
        },
        profile(req, res) {
            let userViewModel = data.userProfile(req.user);

            res.json({ 'user': userViewModel });
        },
        updateUser(req, res) {
            let userInfo = req.body;
            let avatarInfo = utilsFunctions.getRequestFileInfo(req.file);

            if (Object.keys(req.body).length === 0 && avatarInfo === {}) {
                throw Error(message.emptyRequest);
            }

            data.updateUser(req.user._id, userInfo, avatarInfo)
                .then(() => {
                    res.status(constants.statusCodeSuccess).send({
                        'success': true,
                        'message': message.updated
                    });
                })
                .catch((err) => {
                    let errorMessage = err.message;

                    res.status(constants.statusCodeBadRequest).send({
                        'success': false,
                        'message': message.notUpdated,
                        errorMessage
                    });
                });
        },
        getAllUsers(req, res) {
            let query = {};

            data.getAllUsers(query)
                .then((result) => {
                    res.json({
                        'totalUsers': result.count,
                        'items': result.users
                    });
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        getUserById(req, res) {
            data.getUserById(req.params.id)
                .then((user) => {
                    res.json({ 'item': user });
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        deleteUser(req, res) {
            data.deleteUser(req.params.id)
                .then(() => {
                    res.status(constants.statusCodeSuccess).send({
                        'success': true,
                        'message': message.deleted
                    });
                })
                .catch((err) => {
                    let errorMessage = err.message;

                    res.status(constants.statusCodeBadRequest).send({
                        'success': false,
                        'message': message.notDeleted,
                        errorMessage
                    });
                });
        }
    };
};