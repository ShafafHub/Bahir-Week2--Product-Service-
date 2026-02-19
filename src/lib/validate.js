// src/lib/validate.js
const validateProduct = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required");
  }
  if (data.price === undefined || typeof data.price !== "number") {
    errors.push("Price must be a number");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateProduct };
