/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------              User Model              ---------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

// Bring in dependencies
const mongoose = require("mongoose");
const {isEmail} = require('validator');
require('mongoose-type-email');
const bcrypt = require('bcrypt');
const {Error, Schema} = require("mongoose");

// Create the schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email.']
    },
    accessLevel: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minLength: [6, 'Password must have a minimum of 8 characters.']
    },
    bio: {
        type: String,
    }
}, {timestamps: true});

// Execute function before doc gets saved to the database
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Static method to log in user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('Incorrect password.')
    }
    throw Error('Email does not exist.');
}


// Export the model
module.exports = mongoose.model("User", userSchema);

// Mongoose Hooks derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp