const controllerWrapper = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  };
};

module.exports = controllerWrapper;
