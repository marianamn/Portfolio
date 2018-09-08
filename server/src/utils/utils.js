const path = require('path');
const constants = require('../common/constants');
const getMessages = require('../common/messages');
const fs = require('fs');

let message = getMessages('User');

module.exports = {
    isRequestEmpty(requestBody) {
        const zeroLength = 0;

        if (Object.keys(requestBody).length === zeroLength) {
            throw Error(message.emptyRequest);
        }
    },
    isImage(fileExtension) {
        const imageFileExtensions = ['.png', '.jpg', '.gif', '.jpeg'];
        const notFoundIndex = -1;

        return imageFileExtensions.indexOf(fileExtension.toLowerCase()) > notFoundIndex;
    },
    getRequestFileInfo(requestFile) {
        let fileInfo = {};

        if (requestFile) {
            let extension = path.extname(requestFile.originalname);

            if (!this.isImage(extension)) {
                throw Error(message.onlyImagesAllowed);
            }

            if (!requestFile.size > constants.maxFileSize) {
                throw Error(message.fileSizeExceeded);
            }

            fileInfo = requestFile;
        }

        return fileInfo;
    },
    deleteFileFromFileSystem(fileName) {
        if (fileName && fs.existsSync(fileName.toString())) {
            fs.unlinkSync(fileName);
        }
    }
};