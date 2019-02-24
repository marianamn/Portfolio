const dataUtils = require("./utils/data-utils");
const cloudinaryUtils = require("./utils/cloudinary-utils");
const bcrypt = require("bcryptjs");
const viewModel = require("../view-models/user-view-model");
const validateModel = require("../utils/validator");
const constants = require("../common/constants");

const rounds = 10;
const usersCloudinaryImgFolder = "/users";

module.exports = model => {
  let { User } = model;

  return {
    register(user, pictureData) {
      return new Promise((resolve, reject) => {
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role ? user.role : "user",
          isDeleted: false
        });

        if (pictureData && pictureData.public_id) {
          newUser.pictureData = {
            public_id: pictureData.public_id,
            secure_url: pictureData.secure_url
          };
        }

        return this.hashPassword(newUser).then(user => {
          return dataUtils
            .save(newUser)
            .then(user => resolve(viewModel.getUserViewModel(user)))
            .catch(err => reject(err));
        });
      });
    },
    login(user) {
      const { email, password } = user;
      return dataUtils.getUserByEmail(User, email).then(foundUser => {
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
    updateUser(id, userInfoToUpdate, pictureData) {
      return new Promise((resolve, reject) => {


        if (userInfoToUpdate.password) {
          return this.hashPassword(userInfoToUpdate).then(user => {
            return dataUtils
              .update(User, id, user)
              .then(user => resolve(user))
              .catch(err => reject(err));
          });
        } else {

          // Before update user picture, delete previous one if has such
          dataUtils.getById(User, id).then(user => {
            let isUserHasImage = user.pictureData && user.pictureData.public_id !== undefined;
            let isUserPictureRequestedToBeUpdated =
              pictureData && pictureData.public_id !== undefined;

            if (isUserHasImage && isUserPictureRequestedToBeUpdated) {
              cloudinaryUtils.deleteImage(
                user.pictureData.public_id,
                usersCloudinaryImgFolder
              )
              .then( () => {
                return this.hashPassword(user).then(() => {
                  userInfoToUpdate.pictureData = {
                    public_id: pictureData.public_id,
                    secure_url: pictureData.secure_url
                  };
                  return dataUtils
                    .update(User, id, userInfoToUpdate)
                    .then(user => resolve(user))
                    .catch(err => reject(err));
                  })
                }
              );
            } else if (!isUserHasImage && isUserPictureRequestedToBeUpdated) {
              return this.hashPassword(user).then(() => {
                userInfoToUpdate.pictureData = {
                  public_id: pictureData.public_id,
                  secure_url: pictureData.secure_url
                };
                return dataUtils
                  .update(User, id, userInfoToUpdate)
                  .then(user => resolve(user))
                  .catch(err => reject(err));
              });
            } else if (isUserHasImage && !isUserPictureRequestedToBeUpdated) {
              cloudinaryUtils
                .deleteImage(
                  user.pictureData.public_id,
                  usersCloudinaryImgFolder
                )
                .then(() => {
                  userInfoToUpdate.pictureData = null;
                  return this.hashPassword(user).then(() => {
                    return dataUtils
                      .update(User, id, userInfoToUpdate)
                      .then(user => resolve(user))
                      .catch(err => reject(err));
                  });
                });
            } else {
              resolve(dataUtils.update(User, id, userInfoToUpdate));
            }
          });
        }
      });
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
      return dataUtils.update(User, id, { isDeleted: true });
    }
  };
};
