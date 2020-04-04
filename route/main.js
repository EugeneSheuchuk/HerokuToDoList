const express = require('express');
const router = express.Router();
const serverFunction = require('./../serverFunctions');
const mongodb = require('./../db');

router.use((req, res, next) => {
    console.log('Main route: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        const userId = serverFunction.sessionStorage[req.cookies.todoList];
        serverFunction.sendUserLists(res, userId);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        if (req.body.listName.trim() === '') {
            res.status(406).send("Can't create list without name");
            return;
        }
        const userId = serverFunction.sessionStorage[req.cookies.todoList];
        const result = await mongodb.addList(req.body.listName, userId);
        if (result) {
            serverFunction.sendUserLists(res, userId);
        } else {
            res.status(406).send("List was't add");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});
router.put('/', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        if (req.body.newListName.trim() === '') {
            res.status(406).send("Can't change to empty list name");
            return;
        }
        const userId = serverFunction.sessionStorage[req.cookies.todoList];
        const result = await mongodb.changeListName(req.body.listId, req.body.newListName);
        if (result) {
            serverFunction.sendUserLists(res, userId);
        } else {
            res.status(406).send("The name of list was't change");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        const userId = serverFunction.sessionStorage[req.cookies.todoList];
        const result = await mongodb.deleteList(req.body.listId);
        if (result) {
            serverFunction.sendUserLists(res, userId);
        } else {
            res.status(406).send("List was't delete");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;