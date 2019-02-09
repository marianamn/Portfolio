const modelRegistrator = require("./utils/model-registrator");
const constants = require("../common/constants");
const validateModel = require("../utils/validator");

module.exports = modelRegistrator.register("User", {
  name: {
    type: String,
    required: [true, "Name is required!"],
    minlength: [
      constants.nameMinLength,
      `Name must be between ${constants.nameMinLength} and ${
        constants.nameMaxLength
      } characters long!`
    ],
    maxlength: [
      constants.nameMaxLength,
      `Name must be between ${constants.nameMinLength} and ${
        constants.nameMaxLength
      } characters long!`
    ]
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    validate: {
      validator: value => validateModel.validateEmail(value),
      message: "Invalid email format!"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: [
      constants.passwordMinLength,
      `Password must be at least ${
        constants.passwordMinLength
      } characters long!`
    ]
  },
  pictureData: {
    type: {}
  },
  role: {
    type: String
  },
  isDeleted: {
    type: Boolean
  }
});
