const AppError = require("./app.error");

class BadRequestError extends AppError {

    constructor (message) {
        super(message);

        this.status = 400;
    }
}

module.exports = BadRequestError;