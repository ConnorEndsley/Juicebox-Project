const express = require('express');
const apiRouter = express.Router();
const { getAllUsers, getAllPosts, getAllTags } = require('../database');

const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const res = require('express/lib/response');

apiRouter.use('/users', usersRouter);

apiRouter.use('/posts', postsRouter);

apiRouter.use('/tags', tagsRouter)

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
})

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    })
})

module.exports = apiRouter;