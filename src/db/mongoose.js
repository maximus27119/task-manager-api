const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// const myTask = new Task({
//     description: '       Eat lunch        ',
// }).save().then((task) => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// });

// const me = new User({
//     name: '    Bohdan   ',
//     email: 'Bohdan@GMAIL.COM     ',
//     password: '  1234567'
// });

// me.save().then((me) => {
//     console.log(me);
// }).catch((error) => {
//     console.log(error);
// });