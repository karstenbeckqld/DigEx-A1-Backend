/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------              User Model              ---------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

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
    required: [true, 'Please enter an email.'],
    unique: true,
    validate: [isEmail, 'Please enter a valid email.']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minLength: [8, 'Password must have a minimum of 8 characters.']
  },
  bio: {
    type: String,
  },
  accessLevel: {
    type: Number,
  },
});

// Execute function before doc gets saved to the database
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// Execute a function after doc got saved to database
userSchema.post('save', function(doc, next){
  console.log('New user got created & saved', doc);
  next();
})

module.exports = mongoose.model("User", userSchema);