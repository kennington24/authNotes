const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true, // Luis => luis
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  console.log('pre save hook');
  bcrypt.hash(this.password, 12, (err, hash) => {
    // 2 ^ 16.5 ~ 92.k rounds of hashing
    if (err) {
      return next(err);
    }

    this.password = hash; // schema

    return next();
  });
});

// are executed on a mongoose document = instance of a model
UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};

// executed on the model, not on the document
// UserSchema.statics.greet = function(id, passwordGuess) {
//   // find the user document using the id
//   // check the password using bcrypt
//   return bcrypt.compare(passwordGuess, user.password);
// };

module.exports = mongoose.model('User', UserSchema);
