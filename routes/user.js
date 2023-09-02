// User Routes

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// GET - Get all users
router.get("/", async (req, res) => {
    try {
        const result = await User.find({});
        res.render("user/index", {users: result});
    } catch (err) {
        res.redirect("/");
    }
});

// GET - Show Form to input new user
router.get("/new", (req, res) => {
    res.render("user/newUser", {user: new User()});
});

// GET - Get specific user by id
router.get("/:id", async (req, res) => {
    let userId = req.params.id;

    try {
        const foundUser = await User.findById(userId).exec();
        console.log("User Found");
        res.send(foundUser);
    } catch (err) {
        res.redirect("/");
        console.log("Entry not found.");
    }
});


// POST - Receive Form Data from GET('/new')
router.post("/", async (req, res) => {

    // Setup new User object with data from request body.

    let passwordHash;
    const password = req.body.password;

    // Hash the password
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                return console.log('Cannot encrypt');
            }

            passwordHash = hash;
            console.log(hash);

            bcrypt.compare(password, passwordHash,
                async function (err, isMatch) {

                    if (isMatch) {
                        console.log('Encrypted password is: ' + password);
                        console.log('Decrypted password is: ' + passwordHash);
                    }

                    if (!isMatch) {
                        console.log(passwordHash + 'is not encryption of ' + password)
                    }
                })
        })
    })


    /*const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);*/

    // Create new User object with hashed password
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        accessLevel: req.body.accessLevel,
        password: passwordHash,
    });

    // Save the new user to the database
    try {
        await user.save();
        console.log("New user crested.");
        res.redirect('/api/user');

        /* Because the User object defines the email to be unique, mongoose will check for this property and throw an
        exception, if the entered email already is in the database. This will get caught here and the user returned to
        the New User dialog with an error message. */
    } catch (err) {
        res.render("user/newUser", {
            user: user,
            errorMessage: "This email already exists in our database",
        });
        console.log("User already exists.");
        console.log("No user created: " + err);
    }

});

// PUT - Update user with id
router.put("/", async (req, res) => {
    let userId = req.params.id;

    try {
        const foundUser = await User.findById(userId).exec();
        console.log("User Found");
        res.send(foundUser);
    } catch (err) {
        res.redirect("/");
        console.log("Entry not found.");
    }
});

function generatePasswordHash(password) {
    return jwt.sign(password, process.env.TOKEN_SECRET);
}

module.exports = router;
