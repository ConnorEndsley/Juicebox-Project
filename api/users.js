const express = require('express');
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername } = require('../database');
const jwt = require('jsonwebtoken');
const { user } = require('pg/lib/defaults');
const token = jwt.sign({ user: user.id, username: user.username}, process.env.JWT_SECRET);

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next(); 
  });
  
  usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  });

  usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please provide both the username and password"
      });
    }
    try {
      const user = await getUserByUsername(username);

      if(user && user.password == password) {
        res.send({ message : "You're logged in!", token});
      } else {
        next({
          name: 'IncorrectCredentialsError',
          message: 'Username or password incorrect'
        });
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  })

module.exports = usersRouter;



