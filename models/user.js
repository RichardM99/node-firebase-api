"use strict";

// models
//
const BaseModel = require("./base-model");

// errors
//
const NotFoundError = require("../errors/entity-not-found.error");
const UnprocessableEntityError = require("../errors/unprocessable-entity.error");

class User extends BaseModel {

    constructor() {
        super("users");
    }

    /**
     * Creates a user in our db file
     *
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     *
     * @returns {Promise<Object>} db user record
     */
    async create(data) {
        const userExists = await this.readFromDatabase({email: data.email});

        if (userExists) {
            throw new UnprocessableEntityError(`An account with email ${data.email} already exists`);
        }

        return this.writeToDatabase(data);
    }

    /**
     * Updates a user in our db file
     *
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     * @param {string} data.id
     * @param {string} userId
     *
     * @returns {Promise<Object>} db user record
     */
    async update(data, userId) {
        const userExists = await this.readFromDatabase({id: userId});

        if (!userExists) {
            throw new NotFoundError(`Record not found`);
        }

        return this.updateInDatabase(data, userId);
    }

    /**
     * Removes a user from our db file
     *
     * @param {string} userId
     *
     * @returns {Promise<undefined>}
     */
    async delete(userId) {
        const userExists = await this.readFromDatabase({id: userId});

        if (!userExists) {
            throw new NotFoundError(`Record not found`);
        }

        return this.removeFromDatabase(userId);
    }

}

module.exports = new User();