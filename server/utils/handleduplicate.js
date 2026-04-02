const handleDuplicateKeyError = (err, field, message) => {
  if (err.code === 11000 && err.keyPattern && err.keyPattern[field]) {
    return {
      handled: true,
      status: 400,
      message
    };
  }

  return {
    handled: false
  };
};

module.exports = {
  handleDuplicateKeyError
};
