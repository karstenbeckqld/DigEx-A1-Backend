// User Routes

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Handle errors for user signup
// Error handling function derived from Net Ninja Tutorial Node.js Auth Tutorial (JWT),
// https://www.youtube.com/playlist?list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp
const handleErrors = (err) => {

    let errors = {email: '', password: ''};

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'This email is already registered';

        return errors;
    }

    // Input validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });

        return errors;
    }
};

// GET - Get all users -------------------------------------------------------------------------------------------------
// Endpoint: /user
router.get('/', async (req, res) => {
    await User.find()
        .then((users) => {
            res.status(200).json(users);

            // For A3
            // res.render('user/index', { users: result });
        })
        .catch((err) => {
            console.log('Cannot get list of users: ', err);
            res.status(400).json({
                message: 'Cannot get users.',
                error: err
            })

            // For A3
            // res.redirect('/');
        });
});

// GET - Get specific user by id ---------------------------------------------------------------------------------------
// Endpoint: /user/:id
router.get('/:id', async (req, res) => {
    await User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: 'User does not exist.',
                });
            } else {
                console.log('User Found');
                res.json(user);
            }
        })
        .catch((err) => {
            console.log('User not found: ', err);
            res.status(400).json({
                message: 'Cannot find user.',
                error: err
            })

            // For A3
            // res.redirect('/');
        });
});

// GET - Show Form to input new user -----------------------------------------------------------------------------------
// Endpoint: /user/new
router.get('/new', (req, res) => {
    res.render('user/newUser', {user: new User()});
});

// POST - Receive Form Data from GET('/new') ---------------------------------------------------------------------------
// Endpoint: /user
router.post('/', async (req, res) => {

    // Check if the request body is empty and if yes, return here.
    if (!req.body) {
        return res.status(400).json({
            message: "Empty body received."
        });
    }

    // Setup new User object with data from request body.
    const {firstName, lastName, email, accessLevel, password, bio} = req.body;

    // Create new User object
    const user = new User({
        firstName,
        lastName,
        email,
        accessLevel,
        password,
        bio,
    });

    // Save the new user to the database

    await user.save()
        .then((user) => {
            console.log('New user created.');
            res.status(201).json(user);
            //res.redirect('/api/user');
        })
        .catch((err) => {
            /* Because the User object defines the email to be unique, mongoose will check for this property and throw an
             error, if the entered email already is in the database. This will get caught here and the user returned to
             the New User dialog with an error message. */
            console.log('User not created.');
            const errors = handleErrors(err);
            res.status(500).json({errors});


            // For A3
            // res.render('user/newUser', {
            //    user: user,
            //    errorMessage: err,
            // });
        });
});

// PUT - Update user with id -------------------------------------------------------------------------------------------
// Endpoint: /user/:id
router.put('/:id', async (req, res) => {

    // Check if the request body is empty and if yes, return here.
    if (!req.body) {
        return res.status(400).json({
            message: "Empty body received."
        });
    }

    // Update the user model
    await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.log('User not updated.', err);
            res.status(500).json({
                message: 'User not updated.',
                error: err
            });
        })
});

// DELETE - Delete user with id ----------------------------------------------------------------------------------------
// Endpoint: /user/:id
router.delete('/:id', async (req, res) => {

    // Check id ID is missing from the request
    if (!req.params.id) {
        return res.status(400).json({
            message: 'User ID missing from request'
        })
    }

    // Delete the user with Id from request
    await User.findOneAndDelete({_id: req.params.id})
        .then(() => {
            res.json({
                message: `User with ID: ${req.params.id} deleted.`
            })
        })
        .catch((err) => {
            console.log('User not deleted.', err);
            res.status(500).json({
                message: 'User not deleted.',
                error: err
            });
        })
})

module.exports = router;
