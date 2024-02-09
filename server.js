const mongoose = require("mongoose");
require("dotenv").config();
const server = require("./app");
const PORT = process.env.PORT || 5500;
const Mongo_String = process.env.Mongo_String;

const connect = () => {
  mongoose
    .connect(Mongo_String)
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
