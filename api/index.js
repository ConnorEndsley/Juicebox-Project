const express = require('express');
const apiRouter = express.Router();
const { getAllUsers } = require('../database');

const usersRouter = require('./users');

apiRouter.use('/users', usersRouter);

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

module.exports = apiRouter;