const express = require('express');
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, createUsers } = require('../database');
const jwt = require('jsonwebtoken');

// make request to use the route to the user
usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next(); 
  });
  

  // get all users
  usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  });


  // post the users username and password when they attempt to log in
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
        const token = jwt.sign({ 
          id: user.id, 
          username
        }, process.env.JWT_SECRET, {
          expiresIn: '1w'
        });
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


  // authenticate the user, return a jwt
  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUsers({
        username,
        password,
        name,
        location,
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

module.exports = usersRouter;


