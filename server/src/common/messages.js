const constants = require('../common/constants');

module.exports = (item) => {
    let messages = {
        'itemNotFound': `${item} with such Id does not exists!`,
        'created': `${item} was successfully created!`,
        'notCreated': `${item} was not created!`,
        'updated': `${item} was successfully updated!`,
        'notUpdated': `${item} was not updated!`,
        'idCannotBeUpdated': `Cannot update ${item} id!`,
        'deleted': `${item} was successfully deleted!`,
        'notDeleted': `${item} was not deleted!`,

        'emptyRequest': 'Request object passed is empty',
        'loggedIn': `${item} successfully logged in!`,
        'notLoggedIn': `${item} was not logged in!`,
        'registered': `${item} successfully register!`,
        'notRegistered': `${item} was not registered!`,

        // Image messages
        'onlyImagesAllowed': 'Only image formats are allowed!',
        'fileSizeExceeded': `File size must be less than ${constants.maxFileSize}!`
    };

    return messages;
};