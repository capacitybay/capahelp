// extends built in error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    // custom status code
    this.statusCode = statusCode;
  }
}
// creates new error
const createCustomError = (message, statusCode) => {
  return new CustomError(message, statusCode);
};

module.exports = { createCustomError, CustomError };
/**
 * retrieve token from store
 * the compare
 * if match remove else ignore
 *
 */
