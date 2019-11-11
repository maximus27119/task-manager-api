const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.get('/tasks', auth, async (req, res) => { // Получить массив тасков
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try{

        // const tasks = await Task.find({ owner: req.user._id });
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        
        res.send(req.user.tasks);
        
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => { // Поиск таска по айди
    const _id = req.params.id;

    try{
        // const task = await Task.findById(_id);
        const _id = req.params.id;
        const owner = req.user._id;
        const task = await Task.findOne({ _id, owner});

        if(!task){
            res.status(404).send();
        }

        res.send(task);
    }catch(e){
        res.status(500).send();
    }
});

router.post('/tasks', auth, async (req, res) => { // Создание таска
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => { // Обновление данных таска
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid update property!"});
    }

    try{
        // const _id = req.params.id;
        const _id = req.params.id;
        const owner = req.user._id;
        const task = await Task.findOne({ _id, owner});
        // const task = await Task.findById(_id);

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();

        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => { // Удаление таска
    try{
        // const task = await Task.findByIdAndDelete(_id);
        const _id = req.params.id;
        const owner = req.user._id;
        const task = await Task.findOne({ _id, owner});
        
        if(!task){
            return res.status(404).send();
        }

        await task.remove((err, task) => {
            res.send(task);
        });

        
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;
