const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');

const app = express();

app.use(express.json());

// Обработка переходов на страницы

app.use(userRouter);
app.use(taskRouter);

module.exports = app;