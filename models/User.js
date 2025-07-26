const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  phone: String,
  gender: String,
  email: String,
});

module.exports = mongoose.model("User", userSchema);
