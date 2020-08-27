const express = require('express');
const taskControllers = require('../controllers/taskControllers');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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


router.route('/:listId/tasks').get(taskControllers.getAllTasks);
router.route('/:listId/tasks/:taskId').get(taskControllers.getTask);
router.route('/:listId/tasks').post(authenticate,taskControllers.createTask);
router.route('/:listId/tasks/:taskId').patch(authenticate, taskControllers.updateTask);
router.route('/:listId/tasks/:taskId').delete(authenticate, taskControllers.deleteTask);

module.exports = router;