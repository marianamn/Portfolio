const fs = require('fs');
const constants = require('../common/constants');

// Function to encode file data to base64 encoded string
encodeFile = (file) => {
  let bitmap = fs.readFileSync(file);

  return new Buffer(bitmap).toString('base64');
};

module.exports = {
  getUserViewModel(user) {

    let userViewModel = {
      "_id": user._id,
      "name": user.name,
      "username": user.username,
      "email": user.email
    };

    return userViewModel;
  }
};