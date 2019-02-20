const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinaryConfig = require("./cloudinary");

module.exports = folder => {
  cloudinary.config(cloudinaryConfig);
  return multer({
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: folder,
      allowedFormats: ["jpg", "jpeg", "png"],
      filename: (req, file, callback) => {
        callback(undefined, `${Date.now()}-${file.originalname}`);
      }
    })
  })
};
