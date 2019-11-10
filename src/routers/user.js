const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const sharp = require('sharp');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1*1024*1024
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Please, upload a .png or .jpg'));
        }
        cb(undefined, true);
    }
});

router.get('/users/me', auth, async (req, res) => { // Просмотр своего профиля
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

router.get('/users/:id/avatar', async (req, res) => { // Просмотр аватара
    try{
        const user = await User.findById(req.params.id);
        // console.log(user);
        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send(e);
    }
});

router.post('/users', async (req, res) => { // Создание пользователя
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => { // Загрузить фото
    const buffer = await sharp(req.file.buffer).resize(300,300).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
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

router.delete('/users/me/avatar', auth, async (req, res) => { // Удалить фото
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.delete('/users/me', auth, async (req, res) => { // Удаление юзера
    try{
        const user = req.user;
        await req.user.remove();
        sendCancelationEmail(user.email, user.name);
        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;