const mongoose = require('mongoose')
mongoose.Promise = global.Promise;


const postsSchema = mongoose.Schema({

    title: {type: String, required: true},
    destination: {type: String, required: true},
    lodging: String,
    dining: String,
    sites: String,
    activities: String,
    advice: String,
    rating: {type: Number, required: true},
    name: String,
    username: String,
    profileId: String
})

postsSchema.methods.apiRpr = function () {
      return {
        postId: this.id,
        title: this.title,
        destination: this.destination,
        lodging: this.lodging || 'User did not provide lodging feedback',
        sites: this.sites || 'User did not provide feedback on sites',
        advice: this.advice || 'User did not provide additional advice',
        name: this.name,
        username: this.username,
        activities: this.activities || 'User did not provide feedback on activities',
        rating: this.rating,
        dining: this.dining || 'User did not provide feedback on dining',
        profileId: this.profileId
      }
  }



const Posts = mongoose.model('Posts', postsSchema);

module.exports = {Posts};
