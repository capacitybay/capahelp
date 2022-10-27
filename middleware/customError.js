class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

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
