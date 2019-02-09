const cloudinary = require("cloudinary");
const cloudinaryConfigs = require("../../config/cloudinary");

cloudinary.config(cloudinaryConfigs);

module.exports = {
  saveImage(pathToImage, cloudinaryPath) {
    return cloudinary.v2.uploader.upload(
      pathToImage,
      { folder: cloudinaryPath },
      (err, result) => {
        if (err) {
          throw new Error(err);
        }

        return result;
      }
    );
  },
  deleteImage(publicId, cloudinaryPath) {
    return cloudinary.v2.uploader.destroy(
      publicId,
      { folder: cloudinaryPath },
      (err, result) => {
        if (err) {
          throw new Error(err);
        }

        return result;
      }
    );
  }
};
