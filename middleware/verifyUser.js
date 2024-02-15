const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const idFromToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const id = jwt.verify(token, process.env.jwt_secret).data;
  return id;
};
const verifyUser = async (req, res, next) => {
  try {
    const userId = idFromToken(req);
    const user = await User.findById(userId).lean();
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not verify user!",
      });
    }
  } catch (error) {
    res.status(500).json({
        status: "fail",
        message: "Internal server error!",
      });
  }
};
module.exports = verifyUser;
