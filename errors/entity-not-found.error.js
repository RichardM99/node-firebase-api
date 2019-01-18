const AppError = require("./app.error");

class EntityNotFoundError extends AppError {

    constructor (message) {
        super(message);

        this.status = 404;
    }
}

module.exports = EntityNotFoundError;