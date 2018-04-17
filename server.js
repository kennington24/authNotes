const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel'); // model

mongoose
  .connect('mongodb://localhost/authdb')
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

const server = express();

const greet = function(name) {
  return function(req, res, next) {
    req.hello = `hello ${name}!`;

    next();
  };
};

server.use(express.json()); // global middleware

server.use(
  session({
    secret: 'you shall not pass!!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    name: 'auth',
  })
);

server.get('/', (req, res) => {
  // res.send('have a cookie');
  // local middleware
  User.find()
    .then(users => {
      if (users) {
        req.session.name = users[0].username;
      }
      res.json(users);
    })
    .catch(err => {
      res.send('no users yet');
    });
});

server.get('/greet', (req, res) => {
  const { name } = req.session;
  res.send(`hello ${name}`);
});

server.post('/register', (req, res) => {
  const user = new User(req.body); // filling up the document

  user // mongoose document that is mapped to db document
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => res.status(500).json(err));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (user) {
      user.isPasswordValid(password).then(isValid => {
        if (isValid) {
          req.session.name = user.username;
          res.status(200).json({ response: 'Have a cookie' });
        } else {
          res.status(401).json({ msg: 'you shall not pass!!!' });
        }
      });
    }
  });
});

server.listen(5000, () => console.log('\n=== api on port 5000 ===\n'));

// Schema - comples -> model - instantiate -> mongoose document -> db document

// function User (info) {
//   this.name = info.name;
//   this.password =  info.password;
// }

// const user = new User({ name: 'Edwared', password: 'long'})
