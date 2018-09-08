const connection = process.env.MONGODB_URI || 'mongodb://localhost/portfolio';
const portToRun = process.env.PORT || 3001;
const url = process.env.NODE_ENV || `http://localhost${portToRun}`;
let herokuConnectionString = "mongodb://heroku_29ccp20n:3nl1m17vou5482l5h7ij97erof@ds249092.mlab.com:49092/heroku_29ccp20n";

module.exports = {
    connectionString: connection,
    port: portToRun,
    url,
    secret: 'yourSecret',
    herokuConnectionString
};