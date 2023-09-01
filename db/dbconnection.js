const mongoose = require('mongoose').default
const dbConnection = mongoose.connect(process.env.DATABASE_URL)

module.exports = dbConnection