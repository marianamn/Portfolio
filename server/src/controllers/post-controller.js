const constants = require("../common/constants");
const getMessage = require("../common/messages");

module.exports = params => {
  const { data } = params;
  const message = getMessage("Post");

  return {
    createPost(req, res) {
      const newPost = req.body;
      const pictureData = (req.files && req.files.picture && req.files.picture[0]) || undefined;
      const picturesData = (req.files && req.files.pictures) || undefined;

      data
        .createPost(newPost, pictureData, picturesData)
        .then(post => {
          res.status(constants.statusCodeCreated).send({
            success: true,
            message: message.created,
            post
          });
        })
        .catch(err => {
          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notCreated,
            errorMessage: err.message
          });
        });
    },
    getAllPosts(req, res) {
      let query = {};

      data
        .getAllPosts(query)
        .then(result => {
          res.json({
            totalPosts: result.count,
            posts: result.posts
          });
        })
        .catch(err => {
          res.json(err);
        });
    },
    getPostById(req, res) {
      data
        .getPostById(req.params.id)
        .then(post => {
          res.json({ post });
        })
        .catch(err => {
          res.json(err);
        });
    },
    updatePost(req, res) {
      const postInfo = req.body;
      const pictureData = (req.files && req.files.picture && req.files.picture[0]) || undefined;
      const picturesData = (req.files && req.files.pictures) || undefined;

      if (Object.keys(req.body).length === 0) {
        throw Error(message.emptyRequest);
      }

      data
        .updatePost(req.params.id, postInfo, pictureData, picturesData)
        .then(post => {
          res.status(constants.statusCodeSuccess).send({
            success: true,
            message: message.updated,
            post
          });
        })
        .catch(err => {
          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notUpdated,
            errorMessage: err.message
          });
        });
    },
    deletePost(req, res) {
      data
        .deletePost(req.params.id)
        .then(() => {
          res.status(constants.statusCodeSuccess).send({
            success: true,
            message: message.deleted
          });
        })
        .catch(err => {
          res.status(constants.statusCodeBadRequest).send({
            success: false,
            message: message.notDeleted,
            errorMessage: err.message
          });
        });
    }
  };
};
