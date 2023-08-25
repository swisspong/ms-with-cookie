const { validateSignature } = require("../../utils");
const { AuthorizeError } = require("../../utils/errors/app-errors");

module.exports = async (req, res, next) => {
  try {
    const isAuthorized = await validateSignature(req);
    if (isAuthorized) return next();
    throw new AuthorizeError("not authorized to access resources");
  } catch (error) {
    next(error);
  }
};
