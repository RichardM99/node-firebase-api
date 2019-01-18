// errors
//
const InternalError = require("../errors/internal.error");

const errorHandler = (error, req, res, next)=> {

    // an error that we have failed to cater should have no status
    // so just throw a generic internal error
    //
    if (!error.status) {
        error = new InternalError(error);
    }

    // uncomment this line if you want to see errors logged in the console
    //
    // console.log(error);

    return res
        .status(error.status)
        .json({
            ERROR: error
        });
};

module.exports = errorHandler;