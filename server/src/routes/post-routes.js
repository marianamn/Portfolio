const express = require("express");
const passport = require("passport");
const multer = require("multer");
const multerConfig = require("../config/multer");
const Router = express.Router;

module.exports = ({ app, controllers }) => {
  const router = new Router();
  const authorizedMiddleware = passport.authenticate("jwt", { session: false });

  const imagesUploadMiddleware = multerConfig("posts").fields([
    {name: "picture", maxCount: 1},
    {name: "pictures", maxCount: 5}
  ]);

  router
    .get("/posts", controllers.getAllPosts)
    .get("/posts/recent-posts", controllers.getRecentPosts)
    .get("/posts/:id", controllers.getPostById)
    .post("/posts", imagesUploadMiddleware, authorizedMiddleware, controllers.createPost)
    .put("/posts/:id", imagesUploadMiddleware, authorizedMiddleware, controllers.updatePost)
    .put("/posts/delete-post/:id", authorizedMiddleware, controllers.deletePost);

  app.use("/api", router);

  return router;
};
