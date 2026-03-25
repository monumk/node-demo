const validateFields = (requiredFields) => {
  return (req, res, next) => {
    for (const field in requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ msg: requiredFields[field] });
      }
    }
    next(); // move to next middleware/controller
  };
};

module.exports = validateFields;