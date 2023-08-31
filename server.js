// Dependencies
require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3000


// Database Connection

// Express App Setup
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', cors())

// Homepage Route
app.get('/', (req, res) => {
    res.send('This is the homepage')
})

// User Route
app.get('/user', (req, res) => {
    res.send('Listing all users')
})

// Run the App (Listen on a Port)
app.listen(port, () => {
    console.log('App is running on port ', port)
})