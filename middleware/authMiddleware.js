const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // First we check if the token exists an is valid.
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) =>{
            if(err){
                console.log(err.message);
                res.redirect('auth/signin');
            }
            else {
              console.log(decodedToken);
              next();
            }
        });
    }
    else {
        res.redirect('auth/signin');
    }
};

module.exports = { requireAuth };