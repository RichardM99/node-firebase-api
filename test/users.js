"use strict";

const faker = require('faker');
const chai = require("chai");
const expect = chai.expect;

const config = require("../config/config");

const app = require("../server.js");

chai.use(require("chai-http"));

describe("the API endpoint '/users'", function() {
    this.timeout(5000);

    let userData;
    let userId;
    let apiResponse;
    let authToken;
    let idToken;

    describe("creating a user with a POST request", () => {

        before(async ()=> {
            userData = _getMockData();
            apiResponse = await _sendPostRequest(userData);
        });

        it("should return a status code of 201", ()=> {
            expect(apiResponse).to.have.status(201);
        });

        it("should return a USER_RECORD", ()=> {
            expect(apiResponse.body).to.have.own.property("USER_RECORD");
        });

        it("should match the data sent in the request", ()=> {
            expect(apiResponse.body.USER_RECORD.email).to.equal(userData.email);
            expect(apiResponse.body.USER_RECORD.password).to.equal(userData.password);
        });

        it("should return an AUTH_TOKEN", ()=> {
            expect(apiResponse.body).to.have.own.property("AUTH_TOKEN");
        });

        // delete the user afterwards
        //
        after(async ()=> {
            userId = apiResponse.body.USER_RECORD.id;
            authToken = apiResponse.body.AUTH_TOKEN;
            apiResponse = await _exchangeCustomTokenForIdToken(authToken);
            idToken = apiResponse.body.idToken;
            await _sendDeleteRequest(userId, idToken);
        });
    });

    describe("trying to create a user without an email", () => {

        before(async ()=> {
            userData = _getMockData();
            delete userData.email;
            apiResponse = await _sendPostRequest(userData);
        });

        it("should return a status code of 400", ()=> {
            expect(apiResponse).to.have.status(400);
        });

        it("should return an ERROR", ()=> {
            expect(apiResponse.body).to.have.own.property("ERROR");
        });

        it("ERROR should be of type BadRequestError", ()=> {
            expect(apiResponse.body.ERROR.name).to.equal("BadRequestError");
        });
    });

    describe("trying to create a user without a password", () => {

        before(async ()=> {
            userData = _getMockData();
            delete userData.password;
            apiResponse = await _sendPostRequest(userData);
        });

        it("should return a status code of 400", ()=> {
            expect(apiResponse).to.have.status(400);
        });

        it("should return an ERROR", ()=> {
            expect(apiResponse.body).to.have.own.property("ERROR");
        });

        it("ERROR should be of type BadRequestError", ()=> {
            expect(apiResponse.body.ERROR.name).to.equal("BadRequestError");
        });
    });

    describe("trying to create a user without an email or password", () => {

        before(async ()=> {
            userData = {};
            apiResponse = await _sendPostRequest(userData);
        });

        it("should return a status code of 400", ()=> {
            expect(apiResponse).to.have.status(400);
        });

        it("should return an ERROR", ()=> {
            expect(apiResponse.body).to.have.own.property("ERROR");
        });

        it("ERROR should be of type BadRequestError", ()=> {
            expect(apiResponse.body.ERROR.name).to.equal("BadRequestError");
        });
    });

    describe("updating a user with a PUT request", () => {

        // create the user first
        //
        before(async ()=> {
            userData = _getMockData();
            apiResponse = await _sendPostRequest(userData);
            userId = apiResponse.body.USER_RECORD.id;
            authToken = apiResponse.body.AUTH_TOKEN;
        });

        describe("updating a user with a valid id token", () => {

            before(async ()=> {
                apiResponse = await _exchangeCustomTokenForIdToken(authToken);
                idToken = apiResponse.body.idToken;
                userData = _getMockData();
                apiResponse = await _sendPutRequest(userData, userId, idToken);
            });

            it("should return a status code of 200", ()=> {
                expect(apiResponse).to.have.status(200);
            });

            it("should return an UPDATED_USER_RECORD", ()=> {
                expect(apiResponse.body).to.have.own.property("UPDATED_USER_RECORD");
            });

            it("should match the data sent in the request", ()=> {
                expect(apiResponse.body.UPDATED_USER_RECORD.email).to.equal(userData.email);
                expect(apiResponse.body.UPDATED_USER_RECORD.password).to.equal(userData.password);
            });
        });

        describe("updating a user with an invalid id token", () => {

            before(async ()=> {
                apiResponse = await _sendPutRequest(userData, userId, "this is an invalid token");
            });

            it("should return a status code of 401", ()=> {
                expect(apiResponse).to.have.status(401);
            });

            it("should return an ERROR", ()=> {
                expect(apiResponse.body).to.have.own.property("ERROR");
            });

            it("ERROR should be of type AuthenticationError", ()=> {
                expect(apiResponse.body.ERROR.name).to.equal("AuthenticationError");
            });
        });

        // delete the user afterwards
        //
        after(async ()=> {
            await _sendDeleteRequest(userId, idToken);
        });
    });

    describe("deleting a user with a DELETE request", () => {

        // create the user first
        //
        before(async ()=> {
            userData = _getMockData();
            apiResponse = await _sendPostRequest(userData);
            userId = apiResponse.body.USER_RECORD.id;
            authToken = apiResponse.body.AUTH_TOKEN;
        });

        describe("deleting a user with an invalid id token", () => {

            before(async ()=> {
                apiResponse = await _sendDeleteRequest(userId, "this is an invalid token");
            });

            it("should return a status code of 401", ()=> {
                expect(apiResponse).to.have.status(401);
            });

            it("should return an ERROR", ()=> {
                expect(apiResponse.body).to.have.own.property("ERROR");
            });

            it("ERROR should be of type AuthenticationError", ()=> {
                expect(apiResponse.body.ERROR.name).to.equal("AuthenticationError");
            });
        });

        describe("deleting a user with a valid id token", () => {

            before(async ()=> {
                apiResponse = await _exchangeCustomTokenForIdToken(authToken);
                idToken = apiResponse.body.idToken;
                apiResponse = await _sendDeleteRequest(userId, idToken);
            });

            it("should return a status code of 204", ()=> {
                expect(apiResponse).to.have.status(204);
            });

            it("should return a an empty body", ()=> {
                expect(apiResponse.body).to.be.an('object').that.is.empty;
            });

        });
    });
});

const _sendPostRequest = (userData)=> {
    return chai.request(app)
        .post(`/api/users`)
        .send(userData);
};

const _sendPutRequest = (userData, userId, idToken)=> {
    return chai.request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', idToken)
        .send(userData);
};

const _sendDeleteRequest = (userId, idToken)=> {
    return chai.request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', idToken)
        .send(userId);
};

const _exchangeCustomTokenForIdToken = (customToken)=> {
    return chai
        .request("https://www.googleapis.com")
        .post(`/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${config.firebase.webAPIKey}`)
        .set('Content-Type', 'application/json')
        .send({
            token: customToken,
            returnSecureToken: true
        });
};

const _getMockData = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    };
};
