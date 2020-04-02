const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    pass: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;