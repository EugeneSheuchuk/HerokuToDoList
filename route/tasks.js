const express = require('express');
const router = express.Router();
const serverFunction = require('./../serverFunctions');
const mongodb = require('./../db');

router.use((req, res, next) => {
    console.log('Task route: ', Date.now());
    next();
});


router.get('/', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        const tasks = await mongodb.getListTasks(req.query.listId);
        res.send({isAuth: true, data: tasks});
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
        if (req.body.task.taskText.trim() === '') {
            res.status(406).send("Can't add task without text");
            return;
        }
        const result = await mongodb.addTask(req.body.task);
        if (result) {
            const tasks = await mongodb.getListTasks(req.body.task.listId);
            res.send({isAuth: true, data: tasks});
        } else {
            res.status(406).send("The task was't add");
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
        const result = await mongodb.changeTaskStatus(req.body.taskId, req.body.currentStatus);
        if (result) {
            const tasks = await mongodb.getListTasks(req.body.listId);
            res.send({isAuth: true, data: tasks});
        } else {
            res.status(406).send("The task status was't change");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});
router.put('/editTask', async (req, res) => {
    try {
        if (!serverFunction.isUserAuth(req.cookies)) {
            res.send({isAuth: false});
            return;
        }
        if (req.body.newTaskText.trim() === '') {
            res.status(406).send("Can't add task without text");
            return;
        }
        const result = await mongodb.changeTaskText(req.body.taskId, req.body.newTaskText);
        if (result) {
            const tasks = await mongodb.getListTasks(req.body.listId);
            res.send({isAuth: true, data: tasks});
        } else {
            res.status(406).send("The task text was't change");
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
        const result = await mongodb.deleteTask(req.body.taskId);
        if (result) {
            const tasks = await mongodb.getListTasks(req.body.listId);
            res.send({isAuth: true, data: tasks});
        } else {
            res.status(406).send("The task was't delete");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;