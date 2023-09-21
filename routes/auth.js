/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------              Auth Routes               -------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

/*jshint esversion: 8 */
// To avoid validator errors regarding arrow function syntax, we use the above comment line.

// Load required dependencies.
require('dotenv').config();
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const {requireAuth} = require('../middleware/authMiddleware');
const Utils = require('../Utils');


// POST - Sign in user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/signin
// When the user fills in the sign-in form and clicks the confirming button, the form submits a post request, which gets
// handled here.
router.post('/signin', async (req, res) => {

    // First, we check if the request body contains an email and password. If not, or only one got provided, we return
    // and attach a message to the response.
    if (!req.body.email || !req.body.password) {
        console.log('Email or password empty');
        return res.status(400).json({
            message: 'Please provide an email and password.'
        });
    }

    // Define an object that holds the values frm the request body.
    const {email, password} = req.body;

    // The function retrieves the email and password from the request body and uses the login function inside the user
    // model to verify the login. If the login is successful, it creates a JWT token. For convenience, we send this
    // token, together with the user information back in the response.
    await User.login(email, password)
        .then((user) => {
            const userObject = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            const token = Utils.createToken(userObject);

            // Once the token is generated, we return a response with the user object and the token, so that we can
            // verify a successful login in Postman. Where this response will lead in the final website is yet to be
            // determined. That depends on how we want to treat user login in general. It could just log in the user and
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

        // If an error occurs, the user could not get verified, and we return an errors json object displaying the
        // produced errors, plus a 400 status code. In the finished website, this will redirect back to the login form
        // and display errors accordingly.
        .catch((err) => {
            console.log('Cannot log in user: ' + err.message);
            const errors = Utils.handleErrors(err);
            res.status(400).json({
                message: 'Username or password invalid.',
                errors: errors
            });
        });
});

// GET - Validate user -------------------------------------------------------------------------------------------------
// Endpoint: /auth/validate
router.get('/validate', (req, res) => {

    // We use a middleware function called requireAuth in the authMiddleware.js file in the middleware folder. The
    // reason for this outsourcing is so that we can use this function later on in server.js to lock down certain routes
    // and redirect users to the login page when they try to access a restricted area. More details can be found in
    // authMiddleware.js.
    requireAuth(req, res);
});


module.exports = router;

// Use of static login function and handleErrors function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp