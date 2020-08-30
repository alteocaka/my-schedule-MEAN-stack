const User = require('../models/userModel');

// POST request user sign up:

exports.userSignup = async (req, res) => {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
}

// POST request user login:

exports.userLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            })
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    })
}

// Verify refresh token middleware:

let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if(!user){
            return Promise.reject({
                'error': 'User not found. Make sure you are logged in!'
            });
        }

        // If the code reaches here the user was found,
        // therefore the session is valid.

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if(session.token === refreshToken){
                if(User.hasRefreshTokenExpired(session.expiresAt) === false){
                    isSessionValid = true;
                }
            }
        });

        if(isSessionValid){
            next();
            // The session is valid, we continue to
            // process this request.
        }
        else{
            // The session is not valid:
            return Promise.reject({
                'error': 'Refresh token has expired, the session is no longer valid!'
            })
        }
    }).catch((e) => {
        res.status(401).send(e);
    })
}


// GET request, generate and return access token:

exports.getToken =  verifySession, async (req, res) => {
    // We know that the user is authenticated

    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({accessToken});
    }).catch((e) => {
        res.status(400).send(e);
    })
}


