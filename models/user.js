/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------              User Model              ---------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  accessLevel: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
