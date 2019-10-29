const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

taskSchema.pre('save', function (next) {
    const task = this;

    console.log('Just before saving task!');

    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;