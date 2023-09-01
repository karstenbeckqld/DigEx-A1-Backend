// User Routes

const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET - Get all users
router.get('/', async (req, res) => {
    try {
        const findResult = await User.find({})
        res.render('user/index', {users: findResult})
    } catch (err) {
        res.redirect('/')
    }
})

// GET - Show Form to input new user
router.get('/new', (req, res) => {
    res.render('user/newUser', {user: new User()})
})

// GET - Get specific user by id
router.get('/:id', async (req, res) => {
    //res.send('Find user by ID')
    try{
        const foundUser = await User.findById(req.query.id).exec();
        res.send(foundUser);
    } catch (err){
        res.redirect('/')
        console.log("Entry not found.")
    }
})

router.post('/', async (req, res) => {

    // Hash the password
    let passwordHash = generatePasswordHAsh(req.body.password)
    console.log(passwordHash)

    // Create new User object with hashed password
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        accessLevel: req.body.accessLevel,
        password: passwordHash
    })

    try {
        const addUser = await user.save();
        console.log('New user crested.')
    } catch (err) {
        res.redirect('/api/user');
        console.log(err, 'No user created.')
    }
})


function generatePasswordHAsh(password) {
    return jwt.sign(password, process.env.TOKEN_SECRET)
}

module.exports = router