const constants = require('../common/constants');

module.exports = (item) => {
  return {
    itemNotFound: `${item} with such Id does not exists!`,
    created: `${item} was successfully created!`,
    notCreated: `${item} was not created!`,
    updated: `${item} was successfully updated!`,
    notUpdated: `${item} was not updated!`,
    idCannotBeUpdated: `Cannot update ${item} id!`,
    deleted: `${item} was successfully deleted!`,
    notDeleted: `${item} was not deleted!`,
    emptyRequest: 'Request object passed is empty',
    loggedIn: `${item} successfully logged in!`,
    notLoggedIn: `Log in failed!`,
    wrongPassword: "Wrong password",
    registered: `${item} successfully registered!`,
    notRegistered: `${item} was not registered!`,

    // Image messages
    onlyImagesAllowed: 'Only image formats are allowed!',
    fileSizeExceeded: `File size must be less than ${constants.maxFileSize}!`
  }
};