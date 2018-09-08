const fs = require('fs');
const constants = require('../common/constants');

// Function to encode file data to base64 encoded string
encodeFile = (file) => {
    let bitmap = fs.readFileSync(file);

    return new Buffer(bitmap).toString('base64');
};

module.exports = {
    getUserViewModel(user) {
        let url = '';

        if (user.avatar.data.length !== 0) {
            url = `data:${user.avatar.contentType};base64, ${encodeFile(user.avatar.data)}`;
        } else {
            url = constants.defaultUserImage;
        }

        let userViewModel = {
            "_id": user._id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "avatarUrl": url
        };

        return userViewModel;
    }
};