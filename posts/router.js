const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {jwtStrategy} = require('../auth');
const {Posts} = require('./models')
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/posts', passport.authenticate('jwt', {session: false}), (req, res) => {
    const filters = {};
    const queryableFields = ['destination', 'author', 'title', 'dining', 'lodging', 'sites', 'activities'];

    queryableFields.forEach(field => {
        if (req.query[field]) {
              filters[field] = {$regex: req.query[field], $options: 'i'};
        }
    })

    Posts
    .find(filters)
    .exec()
    .then(_posts => {
      console.log(_posts)
      return res.json(_posts.map(post => post.apiRpr()))
    })
    .catch(err => {
              console.error(err);
              res.status(500).json({message: 'internal server error'})
    })
})

router.post('/posts', passport.authenticate('jwt', {session: false}), (req, res) => {
    const requiredFields = ['title', 'author', 'destination', 'rating']
    console.log('hey', req.body)
    const missingFields = requiredFields.filter(field =>  !field in req.body)

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    Posts
    .create({
      title: req.body.title,
      author: req.body.author,
      destination: req.body.destination,
      dining: req.body.dining,
      lodging: req.body.lodging,
      sites: req.body.sites,
      activities: req.body.activities,
      advice: req.body.advice,
      rating: req.body.rating
    })

    .then(post =>  res.status(201).json(post.apiRpr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    })
})

  //     if (filters.title) {
  //    filters.title = {$regex: filters.title, $options: 'i'}
  //  }
   //
  //  if (filters.author) {
  //    filters.author = {$regex: filters.author, $options: 'i'}
  //  }
   //
  //  if (filters.destination) {
  //    filters.destination= {$regex: filters.author, $options: 'i'}
  //  }
//         return res.json({
//             post: ['test', 'help']
//         });
// })

module.exports = {router};
