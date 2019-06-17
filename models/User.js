const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);