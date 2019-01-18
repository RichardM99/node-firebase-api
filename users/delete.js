"use strict";

// database models
//
const user = require("../models/user");
const Firebase = require("../models/firebase");

// errors
//
const BadRequestError = require("../errors/bad-request.error");

/**
 * Handles DELETE request - removing a user
 *
 * @param request
 * @param response
 *
 */
const deleteRequest = async (request, response) => {

    const { userId } = request.params;

    if (!userId) {
        throw new BadRequestError(`Missing userId from request params`);
    }

    try {
        await user.delete(userId);
        await Firebase.deleteUser(userId);

        return response
            .status(204)
            .json();

    } catch(error) {
        throw error;
    }

};

module.exports = deleteRequest;