const { CustomError } = require('./customError.js');
const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .json({ success: false, payload: error.message });
  }
  return res.status(500).json({ payload: error.message });
};

module.exports = errorHandler;
