const connection = process.env.MONGODB_URI || 'mongodb://localhost/portfolio';
const portToRun = process.env.PORT || 3001;
const url = process.env.NODE_ENV || `http://localhost${portToRun}`;
const herokuConnectionString =
  "mongodb://heroku_l4bph0d7:vfdfjmr409k5sog1fjc9iq0vd0@ds127545.mlab.com:27545/heroku_l4bph0d7";

module.exports = {
    connectionString: connection,
    port: portToRun,
    url,
    secret: 'yourSecret',
    herokuConnectionString
};
