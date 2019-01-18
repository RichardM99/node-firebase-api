const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');

// middleware
//
const headers = require("../middleware/headers");
const errorHandler = require("../middleware/error-handler");

module.exports = (app, router) => {
    app.use(headers);

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json());

    app.use(helmet());

    app.use('/api', router);

    app.use(errorHandler);

    app.listen(config.port);

    console.log('listening on port ' + config.port);
};