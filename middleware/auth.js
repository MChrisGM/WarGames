const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtSecret = process.env.JWTSEC;

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};
exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        // res.status(401).json({ message: "Not authorized" });
        return res.redirect("/login");
      } else {
        if (decodedToken.role !== "Basic") {
          // res.status(401).json({ message: "Not authorized" });
          return res.redirect("/login");
        } else {
          next();
        }
      }
    });
  } else {
    // res.status(401).json({ message: "Not authorized, token not available" });
    return res.redirect("/login");
  }
};