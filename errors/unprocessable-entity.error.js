const AppError = require("./app.error");

class UnprocessableEntityError extends AppError {

    constructor (message) {
        super(message);

        this.status = 422;
    }
}

module.exports = UnprocessableEntityError;