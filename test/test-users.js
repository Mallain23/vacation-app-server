
// const chai = require('chai');
// const chaiHTTP = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
//
// const {app, runServer, closeServer} = require('../server');
//
// const should = chai.should();
//
// const {Users} = require('../users/models')
// const {TEST_DATABASE_URL} = require('../config')
//
// chai.use(chaiHTTP);
//
// const seedData = () => {
//     console.info("seeding data")
//     const seedData = []
//
//     for (let i = 1; i <= 10; i++) {
//         seedData.push(generateUserData())
//     }
//
//     return User.insertMany(seedData);
// }
//
// const generateUserData = () => {
//     return {
//       username: faker.name.findName(),
//       password: faker.lorem.sentence(),
//       firstName: faker.name.findName(),
//       lastName: faker.name.findName(),
//       favorite: faker.lorem.sentence(),
//       bio: faker.lorem.sentence(),
//       favoritePosts: [{
//               title: faker.lorem.sentence()
//               destination: faker.lorem.sentence()
//               lodging: faker.lorem.sentence()
//               dining: faker.lorem.sentence()
//               sites: faker.lorem.sentence()
//               activities: faker.lorem.sentence()
//               advice: faker.lorem.sentence()
//               rating: faker.lorem.sentence()
//               name: faker.lorem.sentence()
//               username: faker.lorem.sentence()
//               profileId:faker.lorem.sentence(),
//               postId: faker.lorem.sentence()
//         }]
//     }
// };
//
// const tearDownDb = () => {
//     console.warn('tearing down database')
//     return mongoose.connection.dropDatabase()
// };
//
//
// describe('User Data API', function() {
//
//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });
//
//     beforeEach(function() {
//         return seedData();
//     });
//
//     afterEach(function() {
//         return tearDownDb()
//     });
//
//     after(function() {
//         return closeServer();
//     });
//
//     describe('GET Endpoint', function() {
//
//         it('should return correct user', function() {
//
//           let userObj
//
//
//         User
//           .findOne()
//           .exec()
//           .then(function(user) {
//               userObj.username = user.username
//
//               return chai.request(app)
//             .get(`/users/${userObj.username}`)
//             .then(function(res) {
//
//                 res.should.have.status(200)
//                 res.should.be.json
//                 res.body.should.be.a('object')
//                 res.body.should.have.length.of.at.least(1)
//
//        })
//     })
//
//     describe('PUT Endpoint', function() {
//
//       it('should update a profile with fields', function() {
//
//           const updatedUser= {
//             firstName: 'new title',
//             bio: 'new content',
//             favorite: 'new course',
//             favoritePosts: 'new type'
//           }
//
//           return User
//           .findOne()
//           .exec()
//           .then(function(user) {
//               updatedUser.id = user.id
//               return chai.request(app)
//               .put(`/users/`)
//               .send(updatedUser)
//           })
//
//           .then(function(res) {
//
//               res.should.have.status(201)
//               return User.findById(updatedUser.id).exec()
//           })
//
//           .then(function(user) {
//               user.firstName.should.equal(updatedUser.firstName)
//               user.bio.should.equal(updatedUser.bio)
//               user.favorite.should.equal(updatedUser.favorite)
//               user.favoritePosts.should.equal(updatedUser.favoritePosts)
//           })
//       })
//   })
//
//         it("should add resource to user favoirtes", function() {
//
//             let newFavoriteObject = {
//                                   title: faker.lorem.sentence()
//                                   destination: faker.lorem.sentence()
//                                   lodging: faker.lorem.sentence()
//                                   dining: faker.lorem.sentence()
//                                   sites: faker.lorem.sentence()
//                                   activities: faker.lorem.sentence()
//                                   advice: faker.lorem.sentence()
//                                   rating: faker.lorem.sentence()
//                                   name: faker.lorem.sentence()
//                                   username: faker.lorem.sentence()
//                                   profileId:faker.lorem.sentence(),
//                                   postId: faker.lorem.sentence()
//                                     }
//             return User.findOne()
//             .exec()
//             .then(function(user) {
//
//                 return chai.request(app)
//                 .put(`/users/favorites`)
//                 .send(newResourceObject)
//             })
//
//             .then(function(res) {
//
//                 res.should.have.status(201)
//
//                 return Users.findOne({username: newFavoriteObject.username})
//                 .exec()
//             })
//         })
//     })
//
//     describe('DELETE endpoint', function() {
//
//         it("should delete a favorite", function(){
//
//             let removeFavoriteObj
//
//             return Users.findOne()
//             .exec()
//             .then(function(user) {
//                 removeFavoriteObj.username = user.username
//                 removeFavoriteObj.postId= user.favorites[0].postId
//
//                 return chai.request(app)
//                 .delete(`/favorites/${user.username}/${removeFavoriteObj.postId}`)
//                 .send(removeCourseDataObject)
//             })
//
//             .then(function(res) {
//                 res.should.have.status(201)
//
//                 return Users.findOne({username: removeFavoriteObj.username})
//                 .exec()
//             })
//             .then(function(user) {
//                 let doesFavoriteExist = user.favorites.some(post => post.postId === removeCourseDataObject.postId)
//
//                 doesCourseExist.should.equal(false)
//             })
//         })
//     })
// })
