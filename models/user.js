/*--------------------------------------------------------------------------------------------------------------------*/
/*                                                  User Model                                                        */
/*--------------------------------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    accessLevel: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);