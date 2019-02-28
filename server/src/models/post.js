const modelRegistrator = require("./utils/model-registrator");
const constants = require("../common/constants");
const validateModel = require("../utils/validator");

module.exports = modelRegistrator.register("Post", {
  title: {
    type: String,
    required: [true, "Post title is required!"],
    minlength: [
      constants.postMinLength,
      `Post title must be between ${constants.postMinLength} and ${
        constants.postMaxLength
      } characters long!`
    ],
    maxlength: [
      constants.postMaxLength,
      `Post title must be between ${constants.postMinLength} and ${
        constants.postMaxLength
      } characters long!`
    ]
  },
  content: {
    type: String,
    required: [true, "Post content is required!"],
  },
  category: {
    type: String,
    required: [true, "Category is required!"],
    minlength: [
      constants.nameMinLength,
      `Category name must be between ${constants.nameMinLength} and ${
        constants.nameMaxLength
      } characters long!`
    ],
    maxlength: [
      constants.nameMaxLength,
      `Post name must be between ${constants.nameMinLength} and ${
        constants.nameMaxLength
      } characters long!`
    ]
  },
  tags: {
    type: Array,
    default: []
  },
  author: {
    type: {},
    required: [true, "Author is required!"]
  },
  comments: {
    type: Array,
    default: []
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  pictureData: {
    type: {},
    required: [true, "Main post image is required!"]
  },
  pictures: {
    type: Array
  },
  isDeleted: {
    type: Boolean
  }
});