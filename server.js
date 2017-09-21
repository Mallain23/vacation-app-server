const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const passport = require('passport')
const cors = require('cors');

const {router: usersRouter} = require('./users');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
const {router: postRouter} = require('./posts')

const {PORT, DATABASE_URL} = require('./config');
const {CLIENT_ORIGIN} = require('./config');

const app = express();

mongoose.Promise = global.Promise;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static('public'));

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://designer-tapir-81850.netlify.com');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});


app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);


app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/protected', postRouter);



app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});


let server;

function runServer() {

  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
