const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['student','admin'],
      index:true
    },
  },
);

const userModel = mongoose.model("User", userSchema); 
module.exports = userModel;
