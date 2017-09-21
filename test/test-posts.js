const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

const {Posts} = require('../posts/models')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHTTP);

const seedData = () => {
    console.info("seeding data")
    const seedData = []

    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePostData())
    }

    return Posts.insertMany(seedData);
}

const generatePostData = () => {
    return {
        title: faker.lorem.sentence(),
        destination: faker.lorem.sentence(),
        lodging: faker.lorem.sentence(),
        sites: faker.lorem.sentence(),
        advice:faker.lorem.sentence(),
        name: faker.lorem.sentence(),
        username: faker.lorem.sentence(),
        activities: faker.lorem.sentence(),
        dining: faker.lorem.sentence(),
        profileId: faker.lorem.sentence(),
        rating: 5
    }

}

const tearDownDb = () => {
    console.warn('tearing down database')
    return mongoose.connection.dropDatabase()
};


describe('Post Resource API', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedData();
    });

    afterEach(function() {
        return tearDownDb()
    })

    after(function() {
        return closeServer();
    });

    describe('GET Endpoint', function() {

        it('should return posts with the correct fields', function() {
          let postFilter

        Posts
          .findOne()
          .exec()
          .then(function(post) {
              courseFilter = post.destination
              return chai.request(app)
            .get(`/protected/posts/0/?destination=${courseFilter}`)
            .then(function(res) {

                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a('array')
                res.body.should.have.length.of.at.least(1)

                res.body.forEach(post => {
                    post.should.be.a('object')

                    post.should.include.keys('title', 'destination', 'lodging', 'sites', 'advice', 'name', 'username', 'activities', 'dining', 'rating')
                })

                resPost = res.body[0]


                return Posts.findById(resPost.id).exec()
                })
                .then(function(post) {

                    resPost.title.should.equal(post.title)
                    resPost.destination.should.equal(post.destination)
                    resPost.loding.should.equal(post.lodging)
                    resPost.sites.should.equal(post.sites)
                    resPost.advice.should.equal(post.advice)
              })
          })
       })

       it('should filter resources by the user filters', function() {

          let postFilter

        Posts
          .findOne()
          .exec()
          .then(function(post) {
              courseFilter = post.destination
              return chai.request(app)
              .get(`/protected/posts/0/?destination=${courseFilter}`)
          })

          .then(function(res) {
              res.body.forEach(post => {
                  post.destination.should.equal(courseFilter)
              })
          })
      })
  })
})
//     describe('POST Endpoint', function() {
//
//         it('should add a new resource on POST', function() {
//
//             const newPost = {
//               title: "sample new title",
//               author: 'sameple author',
//               destination: "sample new content",
//               dining: "contracts",
//               sites: "study guide",
//               advice: 'advice',
//               rating: 3
//             }
//
//             return chai.request(app)
//             .post('/api/protected/posts')
//             .send(newPost)
//             .then(function(res) {
//
//                 res.should.have.status(201)
//                 res.should.be.json
//                 res.body.should.be.a('object')
//                 res.body.should.include.keys('title', 'destination', 'dining', 'sites', 'advice', 'author', 'rating')
//                 res.body.title.should.equal(newPost.title)
//                 res.body.destination.should.equal(newPost.destination)
//                 res.body.dining.should.equal(newPost.dining)
//                 res.body.sites.should.equal(newPost.sites)
//                 res.body.author.should.equal(newPost.author)
//                 res.body.rating.should.equal(newPost.rating)
//                 res.body.id.should.not.be.null
//
//                 return Posts.findById(res.body.id).exec()
//             })
//             .then(function(post) {
//
//                 post.title.should.equal(newPost.title)
//                 post.destination.should.equal(newPost.destination)
//                 post.dining.should.equal(newPost.dining)
//                 post.sites.should.equal(newPost.sites)
//             })
//         })
//     })
//
//     describe('PUT Endpoint', function() {
//
//         it('should update a post with correct fields', function() {
//
//             const updatedPost = {
//               title: 'new title',
//               destination: 'new content',
//               dining: 'new content',
//               rating: 10,
//               sites: 'new sites'
//             }
//
//             return Posts
//             .findOne()
//             .exec()
//             .then(function(poat) {
//                 updatedPost.id = post.id
//                 return chai.request(app)
//                 .put(`/protected/posts/${post.id}`)
//                 .send(updatedPost)
//             })
//
//             .then(function(res) {
//
//                 res.should.have.status(201)
//                 return Post.findById(updatedPost.id).exec()
//             })
//
//             .then(function(resource) {
//                 post.title.should.equal(updatedResource.title)
//                 post.destination.should.equal(updatedResource.destination)
//                 post.dining.should.equal(updatedResource.dining)
//                 post.sites.should.equal(updatedResource.sites)
//                 post.rating.should.equal(updatedResource.rating)
//             })
//         })
//     })
//
//     describe('Delete Endpoint', function() {
//
//         it('should delete a post', function() {
//
//             let postId
//
//             return Posts
//             .findOne()
//             .exec()
//             then(function(post) {
//                 postId = post.id
//                 return chai.request(app)
//                 .delete(`protected/posts`)
//             })
//
//             .then(function(res) {
//                 res.should.have.status(204)
//                 return Posts.findById(post).exec()
//             })
//
//             .then(function(post) {
//                 post.should.not.exist;
//             })
//         })
//     })
//
//     describe('Root server endpoint', function() {
//
//         it('reuqest to root server should return 200 status code', function() {
//
//             return chai.request(app)
//             .get('/')
//             .then(function(res) {
//                 res.should.have.status(200);
//             })
//         })
//     })
// })
