"use strict";

// helpers
//
const wrapAsync = require("../utils/wrap-async");

// middleware
//
const verifyUser = require("../middleware/verify-user");

// request handlers
//
const postRequest = require("../users/post");
const putRequest = require("../users/put");
const deleteRequest = require("../users/delete");

const users = (router) => {

    router.route('/users')
        .post(wrapAsync(postRequest));

    router.route('/users/:userId?')
        .put(wrapAsync(verifyUser), wrapAsync(putRequest));

    router.route('/users/:userId?')
        .delete(wrapAsync(verifyUser), wrapAsync(deleteRequest));
};

module.exports = users;