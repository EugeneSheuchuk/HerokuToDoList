const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    listName: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const List = mongoose.model('lists', listSchema);

module.exports = List;