/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------              User Model              ---------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

// Bring in dependencies
const mongoose = require("mongoose");
const {isEmail} = require('validator');
require('mongoose-type-email');
const bcrypt = require('bcrypt');

// Create user schema
// The schema defines the database fields and their properties.
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
        type: mongoose.SchemaTypes.Email,
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

// Mongoose allows for so-called mongoose hooks to be applied in the model. We make use of them here to generate the
// hashed password before the data gets saved to the database. The pre method allows for that to take place before saving
// occurs.

// Execute function before doc gets saved to the database
userSchema.pre('save', async function (next) {

    // We have bcrypt generate a salt first.
    const salt = await bcrypt.genSalt();

    // Now we assign this user's password by having bcrypt generating a hashed password, using above salt.
    this.password = await bcrypt.hash(this.password, salt);

    // Execute next function.
    next();
});

// To facilitate the login process, we add a static method to the user model that checks for validity of the entered
// email address and password. In case of a wrong entry, we throw an error which can be handled by the user route and
// displayed in the form in the front end.

// Static method to log in user
userSchema.statics.login = async function (email, password) {

    // First we retrieve the user from tha database by searching for the email address of the user that wants to log in.
    const user = await this.findOne({email});

    // If the user exists we then compare the hashed password to the entered password.
    if (user) {

        // Bcrypt takes two parameters, the plain password, and, if the user exists, the stored and hashed password from
        // the database.
        const auth = await bcrypt.compare(password, user.password);

        // If the passwords match, we return the user.
        if (auth){
            return user;
        }

        // If the password doesn't match, we trow an error.
        throw Error('incorrect password');
    }

    // If the user doesn't exist, we throw an error.
    throw Error('incorrect email');
};


// Export the model
module.exports = mongoose.model("User", userSchema);

// Mongoose Hooks derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp