const multer = require("multer");
const constants = require("../common/constants");

module.exports = storagePlace => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, storagePlace);
      },
      filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (
        !file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
      ) {
        return callback(constants.onlyImagesAllowed);
      }

      return callback(null, true);
    },
    limits: {
      files: 1,
      fileSize: constants.maxFileSize
    }
  });
};
