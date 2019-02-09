const modelRegistrator = require("./utils/model-registrator");
const constants = require("../common/constants");
const validateModel = require("../utils/validator");

module.exports = modelRegistrator.register("User", {
  name: {
    type: String,
    require: [true, "Name is required!"],
    minlength: constants.nameMinLength,
    maxlength: constants.nameMaxLength
  },
  username: {
    type: String,
    require: [true, "Username is required!"],
    unique: true,
    minlength: constants.nameMinLength,
    maxlength: constants.nameMaxLength
  },
  email: {
    type: String,
    require: [true, "Email is required!"],
    unique: true,
    validate: {
      validator: value => validateModel.validateEmail(value),
      message: "Invalid email format!"
    }
  },
  password: {
    type: String,
    require: [true, "Password is required!"],
    minlength: constants.passwordMinLength
  }
});
