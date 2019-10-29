const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.get('/tasks', async (req, res) => { // Получить массив тасков
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send();
    }
});

router.get('/tasks/:id', async (req, res) => { // Поиск таска по айди
    const _id = req.params.id;

    try{
        const task = await Task.findById(_id);

        if(!task){
            res.status(404).send();
        }

        res.send(task);
    }catch(e){
        res.status(500).send();
    }
});

router.post('/tasks', async (req, res) => { // Создание таска
    const task = new Task(req.body);

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', async (req, res) => { // Обновление данных таска
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid update property!"});
    }

    try{
        const _id = req.params.id;
        const task = await Task.findById(_id);

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

router.delete('/tasks/:id', async (req, res) => { // Удаление таска
    try{
        const _id = req.params.id;
        const task = await Task.findByIdAndDelete(_id);

        if(!task){
            return res.status(404).send();
        }

        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;