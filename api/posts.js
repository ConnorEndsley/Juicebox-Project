const express = require('express');
const usersRouter = express.Router();
const { getAllPosts } = require('../database');


usersRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });
  
  usersRouter.get('/', async (req, res) => {
    const users = await getAllPosts();
  
    res.send({
      users
    });
  });

module.exports = usersRouter;