// Auth Routes

const express = require('express')
const router = express.Router()

// POST - /auth/signin
router.post('/signin', (req, res) => {
        res.send('Auth > Signin Route')
    }
)

// /auth/validate
router.get('/validate', (req, res)=>{
    res.send('Auth > Validate Route')
})

module.exports = router