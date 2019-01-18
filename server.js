const express = require('express');
const app = express();
const router = express.Router();
const glob = require('glob');

/**
 * Loop through all files in the controllers
 * folder and pass the router to each. The controllers
 * are essentially the routes which interrogate their
 * corresponding models.
 *
 */
glob.sync('./controllers/*.js')
    .forEach((file) => {
        file = file.replace('.js','').trim();
        require(file)(router);
    });


// App config
//
require('./config/express')(app,router);

module.exports = app; // for testing