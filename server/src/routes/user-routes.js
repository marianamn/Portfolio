const express = require("express");
const passport = require("passport");
const multer = require("multer");
const multerConfig = require("../config/multer");
const Router = express.Router;

module.exports = ({ app, controllers }) => {
  const router = new Router();
  const authorizedMiddleware = passport.authenticate("jwt", { session: false });

  const imageUploadMiddleware = multerConfig("users").single("picture");

  router
    .get("/users", controllers.getAllUsers)
    .get("/users/:id", controllers.getUserById)
    .post("/register", imageUploadMiddleware, controllers.register)
    .post("/login", controllers.login)
    .put("/users/:id", imageUploadMiddleware, authorizedMiddleware, controllers.updateUser)
    .put("/users/delete-user/:id", authorizedMiddleware, controllers.deleteUser);

  app.use("/api", router);

  return router;
};
