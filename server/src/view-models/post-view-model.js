const fs = require("fs");
const constants = require("../common/constants");
const userViewModel = require("./user-view-model");

module.exports = {
  getPostViewModel(post) {
    const author = userViewModel.getUserViewModel(post.author);

    return {
      id: post._id,
      name: post.name,
      content: post.content,
      category: post.category,
      tags: post.tags,
      author,
      comments: post.comments,
      likes: post.likes,
      dislikes: post.dislikes,
      pictureData: post.pictureData,
      pictures: post.pictures,
      isDeleted: post.isDeleted,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }
};