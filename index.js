const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json());


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use((req, res, next) => {
  console.log("<_____Body logger START___")
  console.log(req.body);
  console.log("____body Logger END__")

  next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);