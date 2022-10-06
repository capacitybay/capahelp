const { CustomError } = require('./customError.js');
const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.status).json({ payload: error.message });
  }
  return res.status(500).json({ result: error.message });
};

module.exports = errorHandler;
