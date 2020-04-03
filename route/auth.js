const express = require('express');
const router = express.Router();
const serverFunction = require('./../serverFunctions');
const mongodb = require('./../db');
const {fromString} = require('uuidv4');

router.use((req, res, next) => {
    console.log('Auth route: ', Date.now());
    next();
});
router.get('/isAuth', (req, res) => {
    if (serverFunction.isUserAuth(req.cookies)) {
        res.send({isAuth: true});
    } else {
        res.send({isAuth: false});
    }
});
router.post('/auth', async (req, res) => {
    try {
        const user = {...req.body};
        const error = serverFunction.checkRequestFields(user);
        if (error.isError) {
            delete error.isError;
            res.status(406).send(error);
            return;
        }
        user.email = user.email.toLocaleLowerCase();
        const checkUser = await mongodb.getUserId(user.email);
        if (!checkUser) {
            res.status(406).send({errorEmail: 'error in email or such email does not exist'});
            return;
        }
        if (checkUser.pass !== user.pass) {
            res.status(406).send({errorPass: 'the password is not valid'});
            return;
        }
        const hashEmail = fromString(checkUser.email);
        serverFunction.setUserSession(hashEmail, checkUser._id);
        res.cookie('todoList', hashEmail, {path: '/', expires: new Date(Date.now() + 2592000)}).send({isAuth: true});
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/registartion', async (req, res) => {
    try {
        const user = {...req.body};
        const error = serverFunction.checkRequestFields(user);
        if (error.isError) {
            delete error.isError;
            res.status(406).send(error);
            return;
        }
        user.email = user.email.toLocaleLowerCase();
        const checkEmail = await mongodb.getUserId(user.email);
        if (checkEmail) {
            res.status(406).send({errorEmail: 'this email has been used'});
            return;
        }
        const userOnDB = await mongodb.addUser(user);
        const hashEmail = fromString(userOnDB.email);
        serverFunction.setUserSession(hashEmail, userOnDB._id);
        res.cookie('todoList', hashEmail, {path: '/', expires: new Date(Date.now() + 2592000)}).send({isAuth: true});
    } catch (e) {
        res.status(500).send(e);
    }
});
router.put('/logout', (req, res) => {
    if (!serverFunction.isUserAuth(req.cookies)) {
        res.send({isAuth: false});
        return;
    }
    serverFunction.sessionStorage[req.cookies.todoList] = null;
    res.send({isAuth: false});
});

module.exports = router;