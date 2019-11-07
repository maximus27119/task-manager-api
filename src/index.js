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

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5db89ba803f7e746fcc10f02');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = User.findOne({ _id: '5db8998edd495540349ff354'});
    try {
        await user.populate('tasks').exec((err, user) => {
            console.log(user.tasks);
        });
    }catch(e){
        console.log(e);
    }
}

// main();