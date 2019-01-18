"use strict";

const shortid = require('shortid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(`./db/db.json`);
const db = low(adapter);

db.defaults({users: []}).write();

class BaseModel {

    /**
     * @param {string} entity - the JSON node the model will write to e.g. 'users'
     *
     */
    constructor(entity) {
        this.entity = entity;
    }

    /**
     * Creates a record in our db file
     *
     * @param {Object} record
     *
     * @returns {Promise<Object>} db record
     */
    writeToDatabase(record) {
        return new Promise((resolve) => {

            record.id = shortid.generate();

            db.get(this.entity)
                .push(record)
                .write();

            resolve(record);
        });
    }

    /**
     * Reads a record from our db file
     *
     * @param {Object} keyValuePair
     * @param {string} keyValuePair.key
     *
     * @returns {Promise<Object>} db record
     */
    readFromDatabase(keyValuePair) {
        return new Promise((resolve) => {

            const result = db.get(this.entity)
                .find(keyValuePair)
                .cloneDeep()
                .value();

            resolve(result);
        });
    }

    /**
     * Updates a record in our db file
     *
     * @param {Object} data
     * @param {string} recordId
     *
     * @returns {Promise<Object>} db record
     */
    updateInDatabase(data, recordId) {
        return new Promise((resolve) => {

            const result = db.get(this.entity)
                .find({id: recordId})
                .assign(data)
                .write();

            resolve(result);
        });
    }

    /**
     * Removes a record from our db file
     *
     * @param {string} recordId
     *
     * @returns {Promise<undefined>}
     */
    removeFromDatabase(recordId) {
        return new Promise((resolve) => {

            db.get(this.entity)
                .remove({id: recordId})
                .write();

            resolve();
        });
    }

}

module.exports = BaseModel;