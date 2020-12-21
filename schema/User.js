const mongoose = require("mongoose");
const { String, Date } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
