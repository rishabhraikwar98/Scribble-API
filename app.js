const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { rateLimit } = require("express-rate-limit");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const postRouter = require("./routes/postRouter");
const imageRouter = require("./routes/imageRouter");
const feedRouter = require("./routes/feedRouter")
const cookieParser = require("cookie-parser");
const protect = require("./middleware/protect");
const upload =require("./middleware/upload")
const verifyUser = require("./middleware/verifyUser");
const app = express();
app.use(cors());
app.use(express.json());
// data sanitization against noSQL query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xss());

//setting additional security headers
app.use(helmet());
//to handle cookies
app.use(cookieParser());
// rate limiting
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);
//auth routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/upload",upload, imageRouter);
// protected routes
app.use("/api/v1/profile", protect, verifyUser, profileRouter);
app.use("/api/v1/post", protect, verifyUser, postRouter);
app.use("/api/v1/home", protect, verifyUser, feedRouter);
//test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, This is Scribble API!" });
});
// handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The endpoint '${req.method} ${req.url}' does not exist on this server.`,
  });
});

module.exports = app;
