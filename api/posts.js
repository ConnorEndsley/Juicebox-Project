const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../database');


postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });
  
  postsRouter.get('/', async (req, res) => {
    const users = await getAllPosts();
  
    res.send({
      users
    });
  });

module.exports = postsRouter;