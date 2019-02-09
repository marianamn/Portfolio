const constants = {
  // Validations
  nameMinLength: 2,
  nameMaxLength: 40,
  passwordMinLength: 6,

  // Status codes
  statusCodeSuccess: 200,
  statusCodeCreated: 201,
  statusCodeBadRequest: 400,

  // URL default query params
  defaultPage: 1,
  defaultItemsPerPage: 20,
  defaultBookSorting: 'author',
  defaultAuthorSorting: 'name',
  defaultGenreSorting: 'name',
  defaultOrder: 'asc',

  // Default pictures
  defaultUserImage: 'https://res.cloudinary.com/mariana-mn/image/upload/v1549709798/myblog/user-2935373_960_720.png',

  // Other
  tokenExpiresIn: 604800,
  maxFileSize: 16777216 // 16megabytes in bytes
};

module.exports = constants;