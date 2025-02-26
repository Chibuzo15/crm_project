/**
 * Standard response formatter for success responses
 * @param {Object} data - Data to include in response
 * @param {string} message - Success message
 * @returns {Object} Formatted response object
 */
const successResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Standard response formatter for error responses
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Additional error details
 * @returns {Object} Formatted error response object
 */
const errorResponse = (message = "Error", statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors,
  };
};

/**
 * Handle promise rejection with appropriate error response
 * @param {Error} error - Error object
 * @param {Response} res - Express response object
 * @returns {Response} Error response
 */
const handleError = (error, res) => {
  console.error(error);

  // Check if it's a mongoose validation error
  if (error.name === "ValidationError") {
    const errors = {};

    // Format mongoose validation errors
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }

    return res.status(400).json(errorResponse("Validation error", 400, errors));
  }

  // Check if it's a duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res
      .status(400)
      .json(errorResponse(`Duplicate value for ${field}`, 400));
  }

  // Default error handling
  return res
    .status(500)
    .json(errorResponse(error.message || "Server error", 500));
};

/**
 * Build MongoDB filter from query parameters
 * @param {Object} query - Query parameters
 * @param {Array} allowedFilters - Allowed filter fields
 * @param {Object} customFilters - Custom filter transformations
 * @returns {Object} MongoDB filter object
 */
const buildFilter = (query, allowedFilters = [], customFilters = {}) => {
  const filter = {};

  // Process each query parameter
  for (const [key, value] of Object.entries(query)) {
    // Skip pagination and sorting parameters
    if (["page", "limit", "sort", "order"].includes(key)) continue;

    // Only process allowed filters
    if (allowedFilters.includes(key)) {
      // Check for custom filter handler
      if (customFilters[key]) {
        const customFilter = customFilters[key](value);
        Object.assign(filter, customFilter);
      } else {
        // Default handling
        filter[key] = value;
      }
    }
  }

  return filter;
};

/**
 * Build pagination options
 * @param {Object} query - Query parameters
 * @returns {Object} Pagination and sorting options
 */
const buildPaginationOptions = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const sort = {};
  if (query.sort) {
    const order = query.order === "desc" ? -1 : 1;
    sort[query.sort] = order;
  }

  return { skip, limit, sort };
};

module.exports = {
  successResponse,
  errorResponse,
  handleError,
  buildFilter,
  buildPaginationOptions,
};
