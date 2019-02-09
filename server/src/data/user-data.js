const dataUtils = require("./utils/data-utils");
const cloudinaryUtils = require("./utils/cloudinary-utils");
const bcrypt = require("bcryptjs");
const viewModel = require("../view-models/user-view-model");
const validateModel = require("../utils/validator");
const constants = require("../common/constants");
const utilsFunctions = require("../utils/utils");

const rounds = 10;

module.exports = model => {
  let { User } = model;

  return {
    register(user, pictureData) {
      return new Promise((resolve, reject) => {
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role ? user.role : "user"
        });

        if (pictureData && pictureData.path) {
          cloudinaryUtils
            .saveImage(pictureData.path, "/myblog/users")
            .then(picture => {
              newUser.pictureData = picture;

              return this.hashPassword(newUser).then(user => {
                return dataUtils
                  .save(newUser)
                  .then(user => resolve(user))
                  .catch(err => reject(err));
              });
            })
            // after saving the image in cloudinary delete it from file system
            .then(() =>
              utilsFunctions.deleteFileFromFileSystem(pictureData.path)
            );
        } else {
          return this.hashPassword(newUser).then(user => {
            return dataUtils
              .save(newUser)
              .then(user => resolve(user))
              .catch(err => reject(err));
          });
        }
      });
    },
    login(user) {
      const username = user.username;
      const password = user.password;

      return dataUtils.getUserByUsername(User, username).then(foundUser => {
        if (!foundUser) {
          return "user not found";
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
        return this.hashPassword(userInfoToUpdate).then(user =>
          dataUtils.update(User, id, user)
        );
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
      }).catch(err => console.log(err));
    },
    getAllUsers(query) {
      return dataUtils.getAll(User, query).then(users => {
        return {
          count: users.count,
          users: users.collection.map(user => {
            return viewModel.getUserViewModel(user);
          })
        };
      });
    },
    getUserById(id) {
      return dataUtils.getById(User, id).then(user => {
        return viewModel.getUserViewModel(user);
      });
    },
    deleteUser(id) {
      return dataUtils.getById(User, id).then(user => {
        dataUtils.delete(User, id);
      });
    }
  };
};
