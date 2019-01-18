"use strict";

const home = (router) => {

    router.route('/home')
        .get(_get);
};

/**
 * Handles GET request
 *
 * @param request
 * @param response
 *
 */
const _get = (request, response) => response.json({message: 'Home'});

module.exports = home;