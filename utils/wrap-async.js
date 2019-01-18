
// catch any errors and pass them along to the next
// middleware in the chain. Needed for catching errors
// with async/await
//
const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = wrapAsync;