// Auth Routes

require('dotenv').config()
const User = require('../models/user');
const express = require('express');
//const {default: mongoose} = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken')
const maxAge = 3 * 24 * 60 * 60;


const createToken = (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    });
}

// Handle errors for user login and validation
// Error handling function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    // incorrect email
    if (err.message === 'Email does not exist.') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'Incorrect password') {
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
}

// GET - Sign in user form
router.get('/signin', (req, res) => {
    res.render('auth/signin', {user: new User()});
})

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
            })
            res.status(200).json({user: user.id});
        })
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        })

    //console.log(email, password);
    //res.send('Auth > Sign in Route');
});

// GET - Validate user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/validate
router.get('/validate', (req, res) => {
    res.send('Auth > Validate Route');
});


module.exports = router;

// Use of static login function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp