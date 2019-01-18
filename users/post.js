"use strict";

// database models
//
const user = require("../models/user");
const Firebase = require("../models/firebase");

// errors
//
const BadRequestError = require("../errors/bad-request.error");

/**
 * Handles POST request - creating a user
 *
 * @param request
 * @param response
 *
 */
const postRequest = async (request, response) => {

    const { email, password } = request.body;

    if (!email || !password) {
        throw new BadRequestError(`Missing ${!email ? "'email'" : "'password'"} from Request Body`);
    }

    let userRecord;
    let firebaseUserRecord;

    try {
        userRecord = await user.create(request.body);
        firebaseUserRecord = await Firebase.createUser(userRecord);

        const firebaseAuthToken = await Firebase.createToken(firebaseUserRecord.uid);

        return response
            .status(201)
            .json({
                USER_RECORD: userRecord,
                AUTH_TOKEN: firebaseAuthToken
            });

    } catch (error) {

        // delete any record that was created
        // if an error is thrown
        //
        if (userRecord) {
            await user.delete(userRecord.id);
        }

        if (firebaseUserRecord) {
            await Firebase.deleteUser(firebaseUserRecord.uid);
        }

        throw error;
    }
};

module.exports = postRequest;