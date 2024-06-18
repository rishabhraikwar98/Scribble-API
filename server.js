const mongoose = require("mongoose");
require("dotenv").config();
const server = require("./app");
const PORT = process.env.PORT || 5500;
const MONGO_STRING = process.env.MONGO_STRING;

const connect = () => {
  mongoose
    .connect(MONGO_STRING)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.error(err.message);
    });
};
connect();

server.listen(PORT, () => {
  console.log(`Server Started on Port :${PORT}`);
});
