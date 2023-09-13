// Auth Routes

require('dotenv').config();
const User = require('../models/user');
const express = require('express');
//const {default: mongoose} = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;


const createToken = (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

// Handle errors for user login and validation
// Error handling function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    // Login checks for email and password. It is not good practice to point a user to which part of the login is wrong
    // as this can help hackers to work out if the email or the password are correct and make their job easier. Therefore,
    // in A3 this will get reduced to a more generic message stating that something is wrong with the email or password.
    // For debugging purposes we, however, left this in place for this assignment to produce clearer error messages.

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({properties}) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// GET - Sign in user form
router.get('/signin', (req, res) => {
    res.render('auth/signin', {user: new User()});
});

// POST - Sign in user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/signin
router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    await User.login(email, password)
        .then((user) => {
            const token = createToken(user.id);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });
            res.status(200).json({
                user: user,
                token: token
            });
        })
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        });
});

// GET - Validate user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/validate
router.get('/validate', (req, res) => {
    res.send('Auth > Validate Route');
});


module.exports = router;

// Use of static login function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp