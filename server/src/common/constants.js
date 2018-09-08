const constants = {
    // Validations
    'nameMinLength': 2,
    'nameMaxLength': 20,
    'passwordMinLength': 6,

    // Status codes
    'statusCodeSuccess': 200,
    'statusCodeCreated': 201,
    'statusCodeBadRequest': 400,

    // URL default query params
    'defaultPage': 1,
    'defaultItemsPerPage': 20,
    'defaultBookSorting': 'author',
    'defaultAuthorSorting': 'name',
    'defaultGenreSorting': 'name',
    'defaultOrder': 'asc',

    // Default pictures
    'defaultUserImage': 'http://www.falketribe.com/images/users/default_user.jpg',

    // Other
    'tokenExpiresIn': 604800,
    'maxFileSize': 16777216 // 16megabytes in bytes
};

module.exports = constants;