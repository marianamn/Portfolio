const config = require('./config');
const data = require('./data')(config.connectionString);
const controllers = require('./controllers')({ data });
const app = require('./config/application')({ data });

require('./routes')({
    app,
    data,
    controllers
});

/* eslint no-console: "off" */
app.listen(config.port, () => {
    console.log(`App listen to port: ${config.port}`);
});