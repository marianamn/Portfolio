const fs = require("fs");
const constants = require("../common/constants");

module.exports = {
  getUserViewModel(user) {
    const picture = user.pictureData ? user.pictureData.secure_url : constants.defaultUserImage;
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
};
