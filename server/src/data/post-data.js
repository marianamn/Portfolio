const dataUtils = require("./utils/data-utils");
const cloudinaryUtils = require("./utils/cloudinary-utils");
const viewModel = require("../view-models/post-view-model");

const postsCloudinaryImgFolder = "/posts";
const mainImageDimensions = "c_scale,h_4288,w_4288/";

module.exports = model => {
  let { Post, User } = model;

  return {
    createPost(post, pictureData, picturesData) {
      return new Promise((resolve, reject) => {
        dataUtils.getById(User, post.authorId)
          .then(user => {
          const tags = post.tags.split(",").map(t => t.trim());
          const newPost = new Post({
            title: post.title,
            content: post.content,
            category: post.category,
            tags,
            author: user,
            isDeleted: false,
            pictures: []
          });

          if (pictureData && pictureData.public_id) {
            const url = pictureData.secure_url;
            const index = url.indexOf("upload");
            newPost.pictureData = {
              public_id: pictureData.public_id,
              secure_url: url.substring(0, index + 7) + mainImageDimensions + url.substring(index + 7, url.length)
            };
          }

          if (picturesData) {
            picturesData.forEach(p => {
              if (p.public_id) {
                newPost.pictures.push({
                  public_id: p.public_id,
                  secure_url: p.secure_url
                });
              }
            });
          }

          return dataUtils
            .save(newPost)
            .then(post => resolve(viewModel.getPostViewModel(post)))
            .catch(err => reject(err));
        });
      });
    },
    getAllPosts(query) {
      return dataUtils.getAll(Post, query).then(posts => {
        return {
          count: posts.count,
          posts: posts.collection.map(post => {
            return viewModel.getPostViewModel(post);
          })
        };
      });
    },
    getPostById(id) {
      return dataUtils.getById(Post, id)
        .then(post => {
          return viewModel.getPostViewModel(post);
        });
    },
    getRecentPosts() {
      return dataUtils.getMostRecent(Post)
        .then(posts => {
          return posts.map(post => viewModel.getPostViewModel(post));
        });
    },
    updatePost(id, postInfo, pictureData, picturesData) {
      return new Promise((resolve, reject) => {
        const findPost = dataUtils.getById(Post, id);
        const findUser = dataUtils.getById(User, postInfo.authorId);

        Promise.all([findPost, findUser])
          .then(result => {
            const post = result[0];
            const user = result[1];

            if(!user && postInfo.authorId) {
              reject(new Error("User does not exist. Please check if authorId is correct!"));
            }

            const tags = postInfo.tags ? postInfo.tags.split(",").map(t => t.trim()) : post.tags;
            const postToUpdate = {
              title: postInfo.title || post.title,
              content: postInfo.content || post.content,
              category: postInfo.category || post.category,
              tags,
              author: user || post.author,
            };

            if(!pictureData){
              reject(new Error("Post main image is required!"));
            }

            const isPostMainPictureRequestedToBeUpdated = pictureData && pictureData.public_id !== undefined;
            const arePostPicturesRequestedToBeUpdated = picturesData;

            if(isPostMainPictureRequestedToBeUpdated && !arePostPicturesRequestedToBeUpdated) {

              cloudinaryUtils.deleteImage(
                post.pictureData.public_id,
                postsCloudinaryImgFolder
              )
              .then(() => {
                const url = pictureData.secure_url;
                const index = url.indexOf("upload");
                postToUpdate.pictureData = {
                  public_id: pictureData.public_id,
                  secure_url: url.substring(0, index + 7) + mainImageDimensions + url.substring(index + 7, url.length)
                };
                return dataUtils
                  .update(Post, id, postToUpdate)
                  .then(post => resolve(post))
                  .catch(err => reject(err));
                })

            } else if(!isPostMainPictureRequestedToBeUpdated && arePostPicturesRequestedToBeUpdated) {

              cloudinaryUtils
                .deleteImages(post.pictures.map(p => p.public_id))
                .then(() => {
                  const pictures = [];
                  picturesData.forEach(p => {
                    pictures.push({
                      public_id: p.public_id,
                      secure_url:  p.secure_url
                    });
                  });
                  postToUpdate.pictures = pictures;

                  return dataUtils
                    .update(Post, id, postToUpdate)
                    .then(post => resolve(post))
                    .catch(err => reject(err));
                })

            } else if(isPostMainPictureRequestedToBeUpdated && arePostPicturesRequestedToBeUpdated) {
              cloudinaryUtils.deleteImage(
                post.pictureData.public_id,
                postsCloudinaryImgFolder
              )
              .then(() => {
                cloudinaryUtils.deleteImages(post.pictures.map(p => p.public_id))
                  .then(() => {
                    const url = pictureData.secure_url;
                    const index = url.indexOf("upload");
                    postToUpdate.pictureData = {
                      public_id: pictureData.public_id,
                      secure_url: url.substring(0, index + 7) + mainImageDimensions + url.substring(index + 7, url.length)
                    };

                    const pictures = [];
                    picturesData.forEach(p => {
                      pictures.push({
                        public_id: p.public_id,
                        secure_url: p.secure_url
                      });
                    });
                    postToUpdate.pictures = pictures;

                    return dataUtils
                      .update(Post, id, postToUpdate)
                      .then(post => resolve(post))
                      .catch(err => reject(err));
                  })
              })
            } else {
              resolve(dataUtils.update(Post, id, postToUpdate));
            }
          });
      })
    },
    deletePost(id) {
      return dataUtils.update(Post, id, { isDeleted: true });
    }
  };
};
