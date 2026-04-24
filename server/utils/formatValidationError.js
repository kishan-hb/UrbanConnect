const formatValidationError = (err) => {
  if (err.name !== 'ValidationError' || !err.errors) {
    return {
      handled: false
    };
  }

  const messages = Object.values(err.errors).map((validationError) => validationError.message);

  return {
    handled: true,
    status: 400,
    message: messages[0] || 'Validation failed'
  };
};

module.exports = {
  formatValidationError
};
