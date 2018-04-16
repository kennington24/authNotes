const express = require('express');
const mongoose = require('mongoose');

const User = require('./auth/UserModel');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

const server = express();

const authenticate = function(req, res, next) {
  req.hello = `hello Jeremy!`;

  next();
};
//
server.use(express.json());

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password, cb); // maybe a promise
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get('/', authenticate, (req, res) => {
  User.find().then(users => res.json(users));
});

server.post('/register', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => res.status(500).json(err));
});

server.listen(5000, () => console.log('\n=== api on port 5000 ===\n'));
