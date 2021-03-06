const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""},
  favorite: {type: String, default: ""},
  bio: {type: String, default: ""},
  avatar: {type: String, default: ""},
  favoritePosts: [{
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
          profileId: String,
          postId: String
    }]
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    bio: this.bio || 'No information provided yet!',
    favorite: this.favorite || 'No information provided yet!',
    avatar: this.avatar || '',
    profileId: this._id,
    favoritePosts: this.favoritePosts || ['']
  };
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};
