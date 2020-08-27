const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const listControllers = require('../controllers/listControllers');

const router = express.Router();

// Checking whether the user has a valid JWT or not:

let authenticate = (req, res, next) => {

    let token = req.header('x-access-token');

    // verify the JWT:
    jwt.verify(token, User.getJWTSecret() , (err, decoded) => {
        if(err){
            // JWT was invalid, we do not authenticate the user.
            res.status(401).send(err);
        }
        else{
            req.user_id = decoded._id;
            next();
        }
    });
}

router.route('/').get(authenticate, listControllers.getAllLists);
router.route('/:id').get(authenticate, listControllers.getList);
router.route('/').post(authenticate, listControllers.createList);
router.route('/:id').patch(authenticate, listControllers.updateList);
router.route('/:id').delete(authenticate, listControllers.deleteList);

module.exports = router; 