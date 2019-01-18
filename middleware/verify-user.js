// models
//
const firebase = require("../models/firebase");

// errors
//
const AuthenticationError = require("../errors/authentication.error");

const verifyUser = async (req, res, next)=> {

    // the resource being requested by the client
    //
    const { userId } = req.params;

    // the client's firebase id token
    //
    const { authorization } = req.headers;

    try {
        const firebaseUserRecord = await firebase.decodeToken(authorization);

        // if the client's token does not match the requested resource
        // - the client is not authorised
        //
        if (firebaseUserRecord.uid !== userId) {
            throw new AuthenticationError();
        } else {
            next();
        }

    } catch(error) {
        throw new AuthenticationError();
    }
};

module.exports = verifyUser;