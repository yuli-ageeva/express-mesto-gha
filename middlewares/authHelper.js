const authHelper = function (req, res, next) {
  req.user = {
    _id: '649d75d38b25b169d720a41b',
  };
  next();
};

module.exports = authHelper;
