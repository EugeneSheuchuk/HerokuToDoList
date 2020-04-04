const mongoose = require('mongoose');
const List = require('./list');
const Task = require('./task');
const User = require('./user');

const status = {
    complete: 'Complete',
    inProcess: 'In progress',
};

module.exports = {
    connectDBOffline() {
        return mongoose.connect('mongodb://localhost:27017/todolists',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    },
    connectDBOnline() {
        return mongoose.connect('mongodb+srv://ToDoListUser:ToDoListUser@todolistproject-pjhmb.mongodb.net/test?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    },
    async addUser(user) {
        try {
            const newUser = new User({
                ...user,
            });
            return await newUser.save();
        } catch (e) {
            return false;
        }
    },
    async getUserId(email) {
        try {
            return await User.findOne({email});
        } catch (e) {
            return false;
        }
    },
    getLists(userId) {
        const query = List.find({userId});
        return query.select('-userId')
    },
    async addList(listName, userId) {
        try {
            const newList = new List({
                listName,
                userId
            });
            await newList.save();
            return true;
        } catch (e) {
            return false;
        }
    },
    async deleteList(id) {
        try {
            await Task.deleteMany({listId: id});
            await List.findOneAndDelete({_id: id});
            return true;
        } catch (e) {
            return false;
        }
    },
    async changeListName(id, newName) {
        try {
            await List.updateOne({_id: id}, {listName: newName});
            return true;
        } catch (e) {
            return false;
        }
    },
    async getListTasks(listId) {
        try {
            return await Task.find({listId});
        } catch (e) {
            console.log('error in getListTasks', e);
        }

    },
    async addTask(task) {
        try {
            const newTask = new Task({
                ...task,
            });
            await newTask.save();
            return true;
        } catch (e) {
            return false;
        }
    },
    async changeTaskStatus(taskId, currentStatus) {
        try {
            const newStatus = currentStatus === status.inProcess ? status.complete : status.inProcess;
            await Task.updateOne({_id: taskId}, {taskStatus: newStatus});
            return true;
        } catch (e) {
            return false;
        }
    },
    async changeTaskText(id, newText) {
        try {
            await Task.updateOne({_id: id}, {taskText: newText});
            return true;
        } catch (e) {
            return false;
        }
    },
    async deleteTask(taskId) {
        try {
            await Task.findOneAndDelete({_id: taskId});
            return true;
        } catch (e) {
            return false;
        }
    },
};