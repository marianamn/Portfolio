const config = require('./config');
const data = require('./data')(config.connectionString);
const controllers = require('./controllers')({ data });
const app = require('./config/application')({ data });

require('./routes')({
    app,
    data,
    controllers
});

app.listen(config.port, () => {
    console.log(`App listen to port: ${config.port}`);
});