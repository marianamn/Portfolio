const dataUtils = require('./utils/data-utils');
const bcrypt = require('bcryptjs');
const viewModel = require('../view-models/user-view-model');
const validateModel = require('../utils/validator');
const constants = require('../common/constants');
const utilsFunctions = require('../utils/utils');

const rounds = 10;

let validateRequiredFieldsArePassed = (user) => {
  let messages = [];
  user.name ? '' : messages.push('Name is required!');
  user.username ? '' : messages.push('Username is required!');
  user.email ? '' : messages.push('Email is required!');
  user.password ? '' : messages.push('Password is required!');

  return messages.join(' ');
};

module.exports = (model) => {
  let { User } = model;

  return {
    register(user) {
      return new Promise((resolve, reject) => {
        const message = validateRequiredFieldsArePassed(user);
        if (message.length > 0) {
          reject(new Error(message));
        }

        if (user.password < constants.passwordMinLength) {
          reject(new Error(`Password must be at least ${constants.passwordMinLength} characters long!`));
        }

        if (!validateModel.validatePasswordContainsDigitsAndLetters(user.password)) {
          reject(new Error('Password must contains only letters and numbers!'));
        }

        const newUser = new User({
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password
        });

        return this.hashPassword(newUser)
          .then(user => {
            return dataUtils.save(newUser)
              .then(user => resolve(user))
              .catch(err => reject(err));
          });
      });
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
                user: viewModel.getUserViewModel(foundUser),
                isMatch
              });
            });
          });
        });
    },
    updateUser(id, userInfoToUpdate) {
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
      })
        .catch(err => console.log(err));
    },
    getAllUsers(query) {
      return dataUtils.getAll(User, query)
        .then((users) => {
          return {
            count: users.count,
            users: users.collection.map((user) => {
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
          dataUtils.delete(User, id);
        });
    }
  };
};