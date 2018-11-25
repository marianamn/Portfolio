const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = (connectionString) => {
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.connect(connectionString, { useNewUrlParser: true });

  // Register all modules
  let User = require('../models/user');

  let models = { User };

  let data = {};

  fs.readdirSync(__dirname)
    .filter((file) => file.includes('-data'))
    .forEach((file) => {
      let modulePath = path.join(__dirname, file);
      let theModule = require(modulePath)(models);

      Object.keys(theModule)
        .forEach((key) => {
          data[key] = theModule[key];
        });
    });

  return data;
};