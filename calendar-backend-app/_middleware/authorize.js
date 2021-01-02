const jwt = require("jsonwebtoken");
const db = require("../_helpers/db");

module.exports = async function authorize(req, res, next) {
  const { secret } = db.config;
  // Get token from cookies
  const token = req.cookies.token || "";
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decrypt = await jwt.verify(token, secret);

    req.user = {
      email: decrypt.email,
    };

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.toString());
  }
};
