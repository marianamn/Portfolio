const multer = require('multer');

module.exports = {
    setFilesStoragePlace(storagePlace) {
        return multer.diskStorage({
            'destination': (req, file, next) => {
                next(null, storagePlace);
            },
            'filename': (req, file, next) => {
                next(null, `${file.fieldname}-${Date.now()}`);
            }
        });
    }
};