const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');


// const bryptjs = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     // console.log(req.method, req.path);
//     if(req.method === 'GET'){
//         res.send('GET requests are disable');
//     } else {
//         next();
//     }
    
// });

// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Please come back later.");
// });

app.use(express.json());

// Обработка переходов на страницы

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});