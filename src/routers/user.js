const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/users/me', auth, async (req, res) => { // Получить массив пользователей
    res.send(req.user);
});

router.get('/users/:id', async (req, res) => { // Поиск пользователя по айди
    const _id = req.params.id;

    try{
        const user = await User.findById(_id);

        if(!user){
            res.status(404).send();
        }

        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

router.post('/users', async (req, res) => { // Создание пользователя
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => { // Войти в профиль (Получить токен)
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // console.log(token);
        res.send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async (req, res) => { // Обновление данных юзера
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid update property!"});
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => { // Удаление юзера
    try{
        // const _id = req.params.id;
        // const user = await User.findByIdAndDelete(_id);
        await req.user.remove();

        // if(!user){
        //     return res.status(404).send();
        // }

        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;