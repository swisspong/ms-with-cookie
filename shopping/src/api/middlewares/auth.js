const { validateSignature, validateSignatureFromCookie } = require("../../utils");

module.exports = async (req, res, next) => {
  console.log("middleware shopping")
  console.log(req.cookies.acjid);
  //  const isAuthorized = await validateSignature(req);
  const isAuthorized = await validateSignatureFromCookie(req);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};
