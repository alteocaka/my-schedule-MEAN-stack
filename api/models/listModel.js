const mongoose = require('mongoose');
const { stringify } = require('querystring');

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});


const List = mongoose.model('List', listSchema);

module.exports = List;