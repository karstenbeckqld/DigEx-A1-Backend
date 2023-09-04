// Auth Routes

require('dotenv').config()

const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken')

// POST - /auth/signin
router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
	res.send('Auth > Signin Route');
});

// /auth/validate
router.get('/validate', (req, res) => {
	res.send('Auth > Validate Route');
});



module.exports = router;
