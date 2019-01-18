const AppError = require("./app.error");

class InternalError extends AppError {

    constructor (error) {
        super(error.message || "An Unknown Error Occurred");

        this.status = 500;
    }
}

module.exports = InternalError;