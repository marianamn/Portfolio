const fs = require("fs");
const constants = require("../common/constants");
const userViewModel = require("./user-view-model");

module.exports = {
  getPostViewModel(post) {
    const author = userViewModel.getUserViewModel(post.author);

    return {
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      author,
      comments: post.comments,
      likes: post.likes,
      dislikes: post.dislikes,
      picture: post.pictureData.secure_url,
      pictures: post.pictures.map(p => p.secure_url),
      isDeleted: post.isDeleted,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }
};