const dataUtils = require('./utils/data-utils');
const bcrypt = require('bcryptjs');
const viewModel = require('../view-models/user-view-model');
const validateModel = require('../utils/validator');
const constants = require('../common/constants');
const utilsFunctions = require('../utils/utils');

const rounds = 10;

let validateFieldExists = (fieldName, message, avatarFileInfo) => {
    if (!fieldName) {
        utilsFunctions.deleteFileFromFileSystem(avatarFileInfo.path);

        throw Error(message);
    }
};

let validateRequiredFieldsArePassed = (user, avatarFileInfo) => {
    validateFieldExists(user.name, 'User name is required!', avatarFileInfo);
    validateFieldExists(user.username, 'Username is required!', avatarFileInfo);
    validateFieldExists(user.email, 'Email is required!', avatarFileInfo);
    validateFieldExists(user.password, 'User password is required!', avatarFileInfo);
};

module.exports = (model) => {
    let { User } = model;

    return {
        register(user, avatarFileInfo) {
            return new Promise((resolve) => {
                validateRequiredFieldsArePassed(user, avatarFileInfo);

                if (!validateModel.validateStringLengthIsAtLeast(user.password, constants.passwordMinLength)) {
                    // If image is already saved in fs but validation error occur - file to be deleted
                    utilsFunctions.deleteFileFromFileSystem(avatarFileInfo.path);

                    throw Error(`Password must be at least ${constants.passwordMinLength} characters long!`);
                }

                if (!validateModel.validatePasswordContainsDigitsAndLetters(user.password)) {
                    // If image is already saved in fs but validation error occur - file to be deleted
                    utilsFunctions.deleteFileFromFileSystem(avatarFileInfo.path);

                    throw Error('Password must contains only letters and numbers!');
                }

                let newUser = new User({
                    'name': user.name,
                    'username': user.username,
                    'email': user.email,
                    'password': user.password
                });

                if (avatarFileInfo.path && avatarFileInfo.mimetype) {
                    newUser.avatar.data = avatarFileInfo.path;
                    newUser.avatar.contentType = avatarFileInfo.mimetype;
                } else {
                    newUser.avatar.data = '';
                    newUser.avatar.contentType = '';
                }

                resolve(newUser);
            })
                .then((newUser) => {
                    return this.hashPassword(newUser);
                })
                .then((resultedUser) => dataUtils.save(resultedUser));
        },
        login(user) {
            const username = user.username;
            const password = user.password;

            return dataUtils.getUserByUsername(User, username)
                .then((foundUser) => {
                    if (!foundUser) {
                        return 'user not found';
                    }

                    return new Promise((resolve, reject) => {
                        bcrypt.compare(password, foundUser.password, (err, isMatch) => {
                            if (err) {
                                reject(err);
                            }

                            resolve({
                                'user': viewModel.getUserViewModel(foundUser),
                                isMatch
                            });
                        });
                    });
                });
        },
        userProfile(user) {
            let userViewModel = viewModel.getUserViewModel(user);

            return userViewModel;
        },
        updateUser(id, userInfoToUpdate, avatarInfo) {
            if (avatarInfo.path) {
                user = {
                    'avatar': {
                        'data': avatarInfo.path,
                        'contentType': avatarInfo.mimetype
                    }
                };

                // Delete user image from folder and then update it with the new one
                dataUtils.getById(User, id)
                    .then((foundUser) => {
                        utilsFunctions.deleteFileFromFileSystem(foundUser.avatar.data);
                    })
                    .then(() => dataUtils.update(User, id, user));
            }

            if (userInfoToUpdate.password) {
                return this.hashPassword(userInfoToUpdate)
                    .then((user) => dataUtils.update(User, id, user));
            } else {
                return dataUtils.update(User, id, userInfoToUpdate);
            }
        },
        hashPassword(user) {
            return new Promise((resolve, reject) => {
                bcrypt.genSalt(rounds, (err, salt) => {
                    if (err) {
                        reject(err);
                    }

                    bcrypt.hash(user.password, salt, (error, hash) => {
                        if (error) {
                            reject(err);
                        }

                        user.password = hash;
                        resolve(user);
                    });
                });
            });
        },
        getAllUsers(query) {
            return dataUtils.getAll(User, query)
                .then((users) => {
                    return {
                        'count': users.count,
                        'users': users.collection.map((user) => {
                            return viewModel.getUserViewModel(user);
                        })
                    };
                });
        },
        getUserById(id) {
            return dataUtils.getById(User, id)
                .then((user) => {
                    return viewModel.getUserViewModel(user);
                });
        },
        deleteUser(id) {
            return dataUtils.getById(User, id)
                .then((user) => {
                    // Delete user image from folder and then delete user
                    utilsFunctions.deleteFileFromFileSystem(user.avatar.data);

                    dataUtils.delete(User, id);
                });
        }
    };
};