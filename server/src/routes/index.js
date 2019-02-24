const fs = require("fs");
const path = require("path");

module.exports = ({ app, controllers, data }) => {
  fs.readdirSync(__dirname)
    .filter(file => file.includes("-routes"))
    .forEach(file => {
      let modulePath = path.join(__dirname, file);

      require(modulePath)({
        app,
        data,
        controllers
      });
    });
};
