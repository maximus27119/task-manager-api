const mongoose = require('mongoose');

mongoDbUrl = process.env.MONGODB_URL;

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
