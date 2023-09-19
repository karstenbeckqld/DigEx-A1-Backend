// Auth Routes

require('dotenv').config();
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {requireAuth} = require('../middleware/authMiddleware');
const maxAge = 3 * 24 * 60 * 60;

// The createToken function takes in a user id and uses the jwt sign() method to create a jsonwebtoken. The required
// secret is stored in the.ebv file for security reasons and gets retrieved from there via the process.env function. It
// then returns the json web token to the calling function.
const createToken = (userObject) => {
    return jwt.sign({userObject}, process.env.ACCESS_TOKEN_SECRET, {

        // Now we set the expiry for this token to 30 minutes.
        expiresIn: '30min'
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
    // For debugging purposes, however, we left this in place for this assignment to produce clearer error messages.

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    /*// duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }*/

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

// GET - Sign in user form ---------------------------------------------------------------------------------------------
// This method is getting the input form for a user to sign in. As this is a simple display of a form, we use get here.
// This function will be relevant to A3.
router.get('/signin', (req, res) => {
    res.render('auth/signin', {user: new User()});
});

// POST - Sign in user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/signin
// When the user fills in the sign in form and clicks the confirming button, the form submits a post request, which gets
// handled here.
router.post('/signin', async (req, res) => {


    // First, we check if the request body contains an email and password. If not, or only one got provided, we return
    // and attach a message to the response.
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Please provide an email and password.'
        })
    }

    const {email, password} = req.body;

    // The function retrieves the email and password from the request body and uses the login function inside the user
    // model to verify the login. If the login is successful, it creates a JWT token and sends it as a cookie to the
    // browser. We use the options for hppOnly, so that it cannot get accessed with front end JS for safety reasons and
    // set the validity of the token to 3 days (maxAge is in milliseconds, why we multiply it here with 1000).
    await User.login(email, password)
        .then((user) => {
            const userObject = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            const token = createToken(userObject);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });

            // Once the token is generated, we return a response with the user object and the token, so that we can
            // verify a successful login in Postman. Where this response will lead in the final website is yet to be
            // determined. That depends on how we want to treat user login in general. It could just login the user and
            // return to the homepage, unlocking access to the restricted aea, or redirect the user directly to the
            // restricted area.
            res.status(200).json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: token
            });
        })

        // If an error occurs, the user could not get verified and we return an errors json object displaying the
        // produced errors, plus a 400 status code. In the finished website, this will redirect back to the login form
        // and display errors accordingly.
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        });
});

// GET - Validate user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/validate
router.get('/validate', (req, res) => {
    requireAuth(req, res);

    // First we get the token from the header
    //const token = req.headers['authorization'].split(' ')[1];

    // Now we can validate the token data and send it back if it's valid.
   /* jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {

        // If not valid, we send back a 403 (forbidden) status.
        if (err) {

            // error occurs when token is invalid. Send 403 response.
            return res.sendStatus(403);
        } else {

            // No error means token is valid, send back token data as response.
            res.json(tokenData);
        }
    });*/


});


module.exports = router;

// Use of static login function and handleErrors function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp