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
    const queryableFields = ['destination', 'username', 'title', 'dining', 'lodging', 'sites', 'activities', 'name'];

    let amount = req.query.amount ? parseInt(req.query.amount) : 20
    console.log(amount)
    console.log('hey', req.query.amount, amount)
    let postId = "599f6382ab4ce80d9217c460"
    queryableFields.forEach(field => {
        if (req.query[field]) {
              filters[field] = {$regex: req.query[field], $options: 'i'};
        }
    })
    let updatedFilters = Object.assign({}, filters, {
      _id: {$ne : postId}
    })
    console.log(updatedFilters)
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
    // }

    Posts
    .find(updatedFilters)
    .limit(amount)
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

router.get('/posts/:postId', passport.authenticate('jwt', {session: false}), (req, res) => {
    let postId = {_id: req.params.postId}
    console.log(postId)

    Posts
    .findOne(postId)
    .exec()
    .then(_post => {
      console.log(_post)
      return res.json(_post.apiRpr())
    })
    .catch(err => {
              console.error(err);
              res.status(500).json({message: 'internal server error'})
    })
})


router.post('/posts', passport.authenticate('jwt', {session: false}), (req, res) => {
    const requiredFields = ['title', 'author', 'destination', 'rating']

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
      rating: req.body.rating,
      name: req.body.name,
      username: req.body.username
    })

    .then(post =>  res.status(201).json(post.apiRpr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    })
})


router.put('/posts',  passport.authenticate('jwt', {session: false}), (req, res) => {
    const requiredFields = ['title', 'username', 'destination', 'rating', 'postId']
    const postId = {_id: req.body.postId}

    const missingFields = requiredFields.filter(field =>  !field in req.body)

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    let updatedObj = req.body


    Posts
    .findOneAndUpdate(postId, updatedObj, {new: true})
    .then(post => {
      res.json(post.apiRpr())
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'})
    })
})


router.delete('/posts/:postId',  passport.authenticate('jwt', {session: false}), (req, res) => {

    if (!req.params.postId) {
        const message = `Request path is missing request ID.`
        console.error(message)

        return res.status(400).send(message)
    }

    let postId = {_id: req.params.postId}

    return Posts
    .findOneAndRemove(postId)
    .exec()
    .then((post) =>  res.status(201).json(post))
    .catch(err => res.status(500).json({message: 'Internal Server Error'}))
})

// router.get('/posts/',  passport.authenticate('jwt', {session: false}), (req, res) => {
//
//       if (!req.params.destination) {
//           const message = `Request path is missing request ID.`
//           console.error(message)
//
//           return res.status(400).send(message)
//       }



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
// }

module.exports = {router};
