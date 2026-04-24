const validateRequiredFields = (payload, requiredFields) => {
  const missingFields = requiredFields.filter((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

module.exports = {
  validateRequiredFields
};
