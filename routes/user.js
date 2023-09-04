// User Routes

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Handle errors for user signup
const handleErrors = (err) => {
    //console.log(err.message, err.code);

    let errors = {email: '', password: ''}

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
}


// GET - Get all users
router.get('/', async (req, res) => {
    const result = await User.find({})
        .then((users) => {
            res.status(200).json(users);

            // For A3
            // res.render('user/index', { users: result });
        })
        .catch((err) => {
            console.log('Cannot get list of users: ', err);

            // For A3
            // res.redirect('/');
        })
});

// GET - Show Form to input new user
router.get('/new', (req, res) => {
    res.render('user/newUser', {user: new User()});
});

// GET - Get specific user by id
router.get('/:id', async (req, res) => {
    let userId = req.params.id;

    try {
        const foundUser = await User.findById(userId).exec();
        console.log('User Found');
        res.send(foundUser);
    } catch (err) {
        res.redirect('/');
        console.log('Entry not found.');
    }
});

// POST - Receive Form Data from GET('/new')
router.post('/', async (req, res) => {
    // Setup new User object with data from request body.
    const {firstName, lastName, email, accessLevel, password, bio} = req.body;

    // Create new User object
    const user = new User({firstName, lastName, email, accessLevel, password, bio});

    // Save the new user to the database

    await user.save()
        .then((result) => {
            console.log('New user created.');
            res.status(201).json(user);
            //res.redirect('/api/user');
        })
        .catch((err) => {
            /* Because the User object defines the email to be unique, mongoose will check for this property and throw an
             error, if the entered email already is in the database. This will get caught here and the user returned to
             the New User dialog with an error message. */
            const errors = handleErrors(err);
            res.status(400).json({errors});
            console.log('No user created.');

            // For A3
            // res.render('user/newUser', {
            //    user: user,
            //    errorMessage: err,
            // });
        })
});


// PUT - Update user with id
router.put('/', async (req, res) => {
    let userId = req.params.id;

    try {
        const foundUser = await User.findById(userId).exec();
        console.log('User Found');
        res.send(foundUser);
    } catch (err) {
        res.redirect('/');
        console.log('Entry not found.');
    }
});

function generateToken(password) {
    return jwt.sign(password, process.env.TOKEN_SECRET);
}


module.exports = router;
