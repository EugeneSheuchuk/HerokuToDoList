const mongodb = require('./db');

const sessionStorage = {};

function isUserAuth(cookies) {
    return (sessionStorage[cookies.todoList] !== undefined && sessionStorage[cookies.todoList] !== null);
}

function setUserSession(field, userId) {
    sessionStorage[field] = userId;
    console.log('serverFunctions sessionStorage', sessionStorage);
}

function checkRequestFields(fields) {
    let error = {isError: false};
    for (let key in fields) {
        let errorKey = `error${key.charAt(0).toUpperCase() + key.slice(1)}`;
        if (fields[key].trim() === '') {
            error.isError = true;
            error[errorKey] = `${key} field cannot be empty`;
        } else {
            error[errorKey] = '';
        }
    }
    if (!error['errorEmail']) {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(fields.email)) {
            error.isError = true;
            error.errorEmail = 'error in email field';
        }
    }
    return error;
}

async function sendUserLists(res, userId) {
    const lists = await mongodb.getLists(userId);
    const promisies = lists.map(async (list) => {
        const tasks = await mongodb.getListTasks(list._id);
        return {
            listId: list._id,
            listName: list.listName,
            tasks,
        };
    });
    Promise.all(promisies)
        .then(response => res.send({isAuth: true, data: response}))
        .catch(error => res.status(500).send(error));
}


module.exports = {
    isUserAuth,
    setUserSession,
    checkRequestFields,
    sendUserLists,
    sessionStorage
};