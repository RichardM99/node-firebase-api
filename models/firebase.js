"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "firebase-adminsdk-zteac@firm-retina-92408.iam.gserviceaccount.com"
});

class Firebase {

    /**
     * Creates a user in our firebase db
     *
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     * @param {string} data.id
     *
     * @returns {Promise<Object>} firebase user record
     */
     static createUser(data) {
        return _createUser(data);
    }

    /**
     * Updates a user in our firebase db
     *
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     * @param {string} data.id
     * @param {string} userId
     *
     * @returns {Promise<Object>} firebase user record
     */
    static updateUser(data, userId) {
        return _updateUser(data, userId);
    }

    /**
     * Removes a user from our firebase db
     *
     * @param {string} userId
     *
     * @returns {Promise<undefined>}
     */
    static deleteUser(userId) {
        return _deleteUser(userId);
    }

    /**
     * Creates a firebase auth token from a user's firebase uid
     *
     * @param {string} userUID
     *
     * @returns {Promise<string>} firebase custom authentication token
     */
    static createToken(userUID) {
        return _createToken(userUID);
    }

    /**
     * Gets a firebase user record from a firebase auth token
     *
     * @param {string} firebaseAuthToken
     *
     * @returns {Promise<Object>} firebase user record
     */
    static decodeToken(firebaseAuthToken) {
        return _decodeToken(firebaseAuthToken);
    }

}

const _createUser = (data) => {
    return admin
        .auth()
        .createUser({
            email: data.email,
            password: data.password,
            uid: data.id
        });
};

const _updateUser = (data, userId) => {
    return admin
        .auth()
        .updateUser(userId, {
            email: data.email,
            password: data.password,
        });
};

const _deleteUser = (userId) => {
    return admin
        .auth()
        .deleteUser(userId);
};

const _decodeToken = (firebaseAuthToken) => {
    return admin
        .auth()
        .verifyIdToken(firebaseAuthToken);
};

const _createToken = (userUID) => {
    return admin
        .auth()
        .createCustomToken(userUID);
};

module.exports = Firebase;