const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const auth = require('./route/auth');
const main = require('./route/main');
const tasks = require('./route/tasks');
const mongodb = require('./db');

const app = express();
let port = process.env.PORT;
if(port == null || port == ''){
    port = 8000;
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', express.static(path.resolve(__dirname, './../build')));
app.use('/auth', auth);
app.use('/main', main);
app.use('/tasks', tasks);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../build/index.html'));
});

// mongodb.connectDBOffline()
//     .then(res => {
//         if (res.connection.readyState !== 0) {
//             app.listen(port, () => console.log(`Server listening port - ${port}`));
//             return;
//         }
//         console.log('Fail to connect to database');
//     })
//     .catch(err => {
//         console.log('err ', err);
//         console.log('mongoDB was not connect ', err);
//     });

mongodb.connectDBOnline()
    .then(res => {
        if (res.connection.readyState !== 0) {
            app.listen(port, () => console.log(`Server listening port - ${port}`));
            return;
        }
        console.log('Fail to connect to database');
    })
    .catch(err => {
        console.log('err ', err);
        console.log('mongoDB was not connect ', err);
    });



