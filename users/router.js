const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();


router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(field => (field in req.body) && typeof req.body[field] !== 'string');

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(field => req.body[field].trim() !== req.body[field])

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
    );

    const tooLargeField = Object.keys(sizedFields).find(field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField ?
                `Must be at least ${sizedFields[tooSmallField].min} characters long` :
                `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {username, password, firstName='', lastName=''} = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();

    return User
        .find({username})
        .count()
        .then(count => {
            if (count > 0) {
            // There is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                 });
              }
          // If there is no existing user, hash the password
            return User.hashPassword(password)
          })
          .then(hash => {
              return User
              .create({
                  username,
                  password: hash,
                  firstName,
                  lastName
              })
          })
          .then(user => res.status(201).json(user.apiRepr()))
          .catch(err => {
          // Forward validation errors on to the client, otherwise give a 500
          // error because something unexpected has happened
          if (err.reason === 'ValidationError') {
              return res.status(err.code).json(err);
          }

          res.status(500).json({code: 500, message: 'Internal server error'});
        });
    });


router.get('/userdata/:user/:profileId', passport.authenticate('jwt', {session: false}), (req, res) => {
  let filter = req.params.user !== 'null' ? { username: req.params.user} : { _id: req.params.profileId}
  
    return User
      .findOne(filter)
      .exec()
      .then(user => res.json(user.apiRepr()))
      .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.put('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const requiredFields = ['firstName', 'lastName'];
    const missingField = requiredFields.find(field => !(field in req.body));

    updatedProfile = req.body
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        })
   }


   const username = {username: req.body.username}

    return User
    .findOneAndUpdate(username, updatedProfile, {new: true})
    .then(user => {
      res.json(user.apiRepr())
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    })
})

router.put('/favorites', passport.authenticate('jwt', {session: false}), (req, res) => {

    const requiredFields = ['username', 'post'];

    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        })
    }
    const username = {username: req.body.username}
    const post = req.body.post

    return User
    .update(username, {$addToSet: {favoritePosts: post}}, {new: true})
    .then(user => {
        return User
            .findOne(username)
            .exec()
        })
    .then(user => res.status(201).json(user.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    })
})


router.delete('/favorites/:postId/:username', passport.authenticate('jwt', {session: false}), (req, res) => {

    if (!req.params.postId || !req.params.username) {
        const message = `Request path is missing a required field.`
        console.error(message)

        return res.status(400).send(message)
    }

    const { username, postId } = req.params

    return User
    .findOneAndUpdate({username}, {$pull: {favoritePosts: {postId}}})
    .exec()
    .then(user => {
        return User
            .findOne({username})
            .exec()
        })
    .then(user => res.status(201).json(user.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    });
});


module.exports = {router};
