const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskText: String,
    taskStatus: String,
    isEdit: Boolean,
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;