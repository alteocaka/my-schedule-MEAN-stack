const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const listRoutes = require('../api/routes/listRoutes');
const taskRoutes = require('../api/routes/taskRoutes');

// Initializing Express:
const app = express();

// Database connection:
const dbURL = 'mongodb+srv://alteocaka:alteo12345@cluster0.v6mew.mongodb.net/task-manager'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .catch((err) => console.log(err));

// Importing the models:

// We do not need to import them because we have created the controllers for them:
// const List = require('./models/listModel');
// const Task = require('./models/taskModel');
const User = require('./models/userModel');

// Middleware:
app.use(bodyParser.json());

// Checking whether the user has a valid JWT or not:

// let authenticate = (req, res, next) => {

//     let token = req.header('x-access-token');

//     // verify the JWT:
//     jwt.verify(token, User.getJWTsecret ,(err, decoded) => {
//         if(err){
//             // JWT was invalid, we do not authenticate the user.
//             res.status(401).send(err);
//         }
//         else{
//             req.user._id = decoded._id;
//             next();
//         }
//     })
// }

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


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, PUT, PATCH, DELETE"); // ALLOW METHODS
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "x-access-token, x-refresh-token, content-type, _id");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    next();
});


// Routes:

app.use('/lists', listRoutes);
app.use('/lists', taskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

// User routes (transfering it later to its own routes file):

// POST request, user sign up

app.post('/users', (req, res) => {
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
})

// POST request, user login:

app.post('/users/login', (req, res) => {
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
})

// GET request, generates and returns an access token:

app.get('/users/me/access-token', verifySession, (req, res) => {
    // We know that the user is authenticated

    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({accessToken});
    }).catch((e) => {
        res.status(400).send(e);
    })
})
