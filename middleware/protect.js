const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  try {
    let authorized;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      authorized = jwt.verify(token, process.env.jwt_secret);
      if (authorized) {
          next();
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "unauthorized to access!",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "unauthorized to access!",
    });
  }
};
module.exports = protect;
