const mongoose = require('mongoose');
// const lodash = require('lodash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { resolve } = require('path');
// const { reject } = require('lodash');
const _ = require('lodash');
const { realpathSync } = require('fs');

// JWT Secret:

const secret = 'a3sgbh398ah30aj230aj20ah23sa';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

// Instance methods:

// Method for returning the user in the frontend:

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    // Returning the document beside the 
    // password and sessions which should 
    // not be made public:

    return _.omit(userObject, ['password', 'sessions']);
}

// Method for genereating the JWT token:

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        // Here we create the JWT token:
        jwt.sign({ _id: user._id.toHexString() }, secret, { expiresIn: "10s" }, (err, token) => {
            if (!err) {
                resolve(token)
            }
            else {
                reject();
            }
        });
    });
}

// Method for generating refresh token:

UserSchema.methods.generateRefreshToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');
                return resolve(token);
            }
        })
    })
}

// Method for creating session:

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Falied to save session to database!' + e);
    })
}

// Saving session to database:

// Session = Refresh Token + Expiry time !

let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expiresAt });

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}


// Model methods (static methods): 

UserSchema.statics.getJWTSecret = function () {
    return secret;
}

UserSchema.statics.findByIdAndToken = function (_id, token) {
    const User = this;

    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;

    if (expiresAt > secondsSinceEpoch) {
        return false
    }
    else {
        return true;
    }
}

// Middleware:

// This code runs before a user is saved:

UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if (user.isModified('password')) {
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = User;
