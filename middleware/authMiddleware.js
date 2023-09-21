/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------              Auth Middleware               ---------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

/*jshint esversion: 8 */
// To avoid validator errors regarding arrow function syntax, we use the above comment line.

// The authMiddleware function provides an easy way to control access to restricted pages by verifying the JWT token on
// the server. The reason why this function got moved to its own file is so that we can use it for individual routes
// later on. This can be done in the following way (example):
// app.get('/restrictedRoute', requireAuth, (req, res) => {res.send('This is the homepage'); });
// If the routes are set properly (for the final stage of the project), the server will then redirect, for example, to
// the signin page if a user requests access.
// For now, we've limited the functionality to displaying the presence, or absence, of a token.

const jwt = require('jsonwebtoken');

// The requireAuth function takes three parameters, the request, response and next. The latter is required to be able
// to use this function as middleware, so that it calls the next execution point. This is required if we want to use the
// function in the way as described above. At the current stage, however, the next parameter doesn't get used as the
// function is only called in isolation.
const requireAuth = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    // First we check if the token exists an is valid.
    if (token) {

        // If a token exists, we can try to verify it with the server.
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) =>{

            // If verification fails, we return the error. In the final project, this response could lead to the
            // signin page.
            if(err){
                console.log(err.message);
                res.sendStatus(403);
            }

            // If verification succeeds, we return the token. In the final project, this response could lead to a part
            // of the site that is only accessible to logged-in users.
            else {
              console.log(decodedToken);
              res.status(200).json(decodedToken);
            }
        });
    }

    // If there is no token at all, we return a message. In the final project, this will lead to the signin page.
    else {
        res.status(400).json({
            message: 'No token available.'
        });
    }
};

// Finally, we export the function.
module.exports = { requireAuth };