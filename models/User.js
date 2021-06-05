const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String,
  emailAddress: String,
  password: String,
  role: String,
  information: [
    {
      firstName: String,
      middleName: String,
      lastName: String,
      contactNumber: Number,
      address: String,
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});
module.exports = mongoose.model('User', UserSchema);
