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
    username: String
})

postsSchema.methods.apiRpr = function () {
      return {
        postId: this.id,
        title: this.title,
        destination: this.destination || '',
        lodging: this.lodging || '',
        sites: this.sites || '',
        advice: this.advice || '',
        name: this.name,
        username: this.username,
        activities: this.activities || '',
        rating: this.rating,
        dining: this.dining || ''
      }
  }
//
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   firstName: {type: String, default: ""},
//   lastName: {type: String, default: ""},
//   bio: {type: String, default: ""},
//   avatar: {type: String, default: ""},
// });


const Posts = mongoose.model('Posts', postsSchema);

module.exports = {Posts};
