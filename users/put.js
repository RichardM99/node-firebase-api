"use strict";

// database models
//
const user = require("../models/user");
const Firebase = require("../models/firebase");

// errors
//
const BadRequestError = require("../errors/bad-request.error");

/**
 * Handles PUT request - updating a user
 *
 * @param request
 * @param response
 *
 */
const putRequest = async (request, response) => {

    const { userId } = request.params;

    if (!userId) {
        throw new BadRequestError(`Missing userId from request params`);
    }

    const originalUserRecord = await user.readFromDatabase({id: userId});

    let updatedUserRecord;
    let updatedFirebaseUserRecord;

    try {
        updatedUserRecord = await user.update(request.body, userId);
        updatedFirebaseUserRecord = await Firebase.updateUser(updatedUserRecord, userId);

        return response
            .status(200)
            .json({
                UPDATED_USER_RECORD: updatedUserRecord
            });

    } catch(error) {

        // revert any changes that were made
        // if an error is thrown
        //
        if (updatedUserRecord) {
            await user.update(originalUserRecord, userId);
        }

        if (updatedFirebaseUserRecord) {
            await Firebase.updateUser(originalUserRecord, userId);
        }

        throw error;
    }

};

module.exports = putRequest;