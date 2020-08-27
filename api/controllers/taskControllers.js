const Task = require('../models/taskModel');
const List = require('../models/listModel');

// Get all tasks from a specific list:

exports.getAllTasks = async (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
}

// Get a specific task from a specific list:

exports.getTask = async (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
}


// Create a new task within a specific list:

exports.createTask = async (req, res) => {

    // We want to see if the user is valid
    // and has a list first:

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        // Return true if the list is valid
        if (list) {
            return true
        }
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            });
        }
        else {
            res.sendStatus(404);
        }
    })
}

// Update a specific task, within a specific list:

exports.updateTask = async (req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            return true
        }
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                $set: req.body
            }).then(() => {
                res.send({ message: 'Updated successfully!' });
            });
        }
        else {
            res.sendStatus(404);
        }
    })
}

// Delte a specific task, within a specific list:

exports.deleteTask = async (req, res) => {

        List.findOne({
            _id: req.params.listId,
            _userId: req.user_id
        }).then((list) => {
            if (list) {
                return true
            }
            return false;
        }).then((canDeleteTasks) => {
            
            if (canDeleteTasks) {
                Task.findOneAndDelete({
                    _id: req.params.taskId,
                    _listId: req.params.listId
                })
                    .then((removedTaskDoc) => {
                        res.send(removedTaskDoc);
                    });
            }
            else{
                res.sendStatus(404);
            }
        });
    }

