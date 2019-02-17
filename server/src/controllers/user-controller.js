const config = require("../config/index");
const jwt = require("jsonwebtoken");
const constants = require("../common/constants");
const getMessage = require("../common/messages");
const utilsFunctions = require("../utils/utils");

module.exports = params => {
  const { data } = params;
  const message = getMessage("User");

  return {
    register(req, res) {
      const newUser = req.body;
      const pictureData = req.file;

      data
        .register(newUser, pictureData)
        .then(user => {
          res.status(constants.statusCodeCreated).send({
            success: true,
            message: message.registered,
            user
          });
        })
        .catch(err => {
          let errorMessage = err.message;
          // If unique field is duplicated customize error message
          if (err.code === 11000 && err.name === "MongoError") {
            errorMessage = "User already exists!";
          }
          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notRegistered,
            errorMessage
          });
        });
    },
    login(req, res) {
      let user = req.body;

      data
        .login(user)
        .then(result => {
          if (result === "user not found") {
            throw Error("User not found. Make sure your email is correct!");
          }

          if (result.isMatch) {
            const token = jwt.sign(result.user, config.secret, {
              expiresIn: constants.tokenExpiresIn
            });

            res.status(constants.statusCodeCreated).send({
              success: true,
              message: message.loggedIn,
              token: `Bearer ${token}`,
              user: result.user
            });
          } else {
            res.json({
              success: false,
              message: message.wrongPassword,
              errorMessage: "User not found. Make sure your password is correct!"
            });
          }
        })
        .catch(err => {
          let errorMessage = err.message;

          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notLoggedIn,
            errorMessage
          });
        });
    },
    updateUser(req, res) {
      const userInfo = req.body;
      const pictureData = req.file;

      if (Object.keys(req.body).length === 0) {
        throw Error(message.emptyRequest);
      }

      data
        .updateUser(req.user._id, userInfo, pictureData)
        .then(user => {
          res.status(constants.statusCodeSuccess).send({
            success: true,
            message: message.updated,
            user
          });
        })
        .catch(err => {
          let errorMessage = err.message;

          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notUpdated,
            errorMessage
          });
        });
    },
    getAllUsers(req, res) {
      let query = {};

      data
        .getAllUsers(query)
        .then(result => {
          res.json({
            totalUsers: result.count,
            items: result.users
          });
        })
        .catch(err => {
          res.json(err);
        });
    },
    getUserById(req, res) {
      data
        .getUserById(req.params.id)
        .then(user => {
          res.json({ item: user });
        })
        .catch(err => {
          res.json(err);
        });
    },
    deleteUser(req, res) {
      data
        .deleteUser(req.params.id)
        .then(() => {
          res.status(constants.statusCodeSuccess).send({
            success: true,
            message: message.deleted
          });
        })
        .catch(err => {
          let errorMessage = err.message;

          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notDeleted,
            errorMessage
          });
        });
    }
  };
};
