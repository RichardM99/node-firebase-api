const AppError = require("./app.error");

class AuthenticationError extends AppError {

    constructor (message) {
        super(message || "Unauthorized");

        this.status = 401;
    }
}

module.exports = AuthenticationError;