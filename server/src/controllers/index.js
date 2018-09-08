const fs = require('fs');
const path = require('path');

module.exports = (params) => {
    let controllers = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-controller'))
        .forEach((file) => {
            let modulePath = path.join(__dirname, file);
            let theModule = require(modulePath)(params);

            Object.keys(theModule)
                .forEach((key) => {
                    controllers[key] = theModule[key];
                });
        });

    return controllers;
};