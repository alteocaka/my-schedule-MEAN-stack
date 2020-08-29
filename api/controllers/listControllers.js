const List = require('../models/listModel');
const Task = require('../models/taskModel');

// Get all lists:

exports.getAllLists = async (req, res) => {
    try {
        const lists = await List.find({
            _userId:  req.user_id
        });
        res.status(200).json(
            lists);

    } catch (err) {
        throw err;
    }
}

// Get a certain list:
exports.getList = async (req, res) => {
    try {
        const id = req.params.id;
        const list = await List.findOne({ _id: id });
        if (!list) {
            res.status(404).json({
                status: 'List not found!'
            });
        }
        res.status(200).json({
            status: 'Success!',
            list
        })

    } catch (err) {
        throw err;
    }
}

// Create a list:
exports.createList = async (req, res) => {
    try {
        const title = req.body.title;
        const list = new List({
            title,
            _userId: req.user_id
        });

        await list.save();

        res.status(200).json({
            status: 'success',
            list
        })

    } catch (err) {
        throw err;
    }
}

// Update a list:

exports.updateList = async (req, res) => {
    try {
        List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
            $set: req.body
        }).then(() => {
            res.sendStatus({
                'message': 'List has been updated successfully!'
            });
        });
    }
    catch (err) {
        throw err;
    }
}

// Delete a list:

exports.deleteList = async (req, res) => {
    try {
        List.findOneAndDelete({ _id: req.params.id,_userId: req.user_id })
            .then((removedListDoc) => {
                res.send(removedListDoc);

                // We also delete the tasks associated
                // with this list:
                deleteTasksFromList(removedListDoc._id);
            });
    }
    catch (err) {
        throw err;
    }
}

// Helper methods:

let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log('Tasks from' + _listId + 'were deleted successfully! ');
    });
}


