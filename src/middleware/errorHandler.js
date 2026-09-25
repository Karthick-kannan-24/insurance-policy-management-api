const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Multer errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0];

    return res.status(409).json({
      success: false,
      message: duplicateField
        ? `${duplicateField} already exists`
        : "Duplicate record",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

export default errorHandler;