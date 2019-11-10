const mongoose = require('mongoose');

mongoDbUrl = process.env.MONGODB_URL;

mongoose.connect(mongoDbUrl, {
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