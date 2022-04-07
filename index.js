require('dotenv').config();

const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
const apiRouter = require('./api');


server.use(morgan('dev'));

server.use(express.json());

const {client} = require('./database');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use((req, res, next) => {
  console.log("<_____Body logger START___")
  console.log(req.body);
  console.log("____body Logger END__")

  next();
});

server.use('/api', apiRouter);
