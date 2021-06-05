const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: String,
  title: String,
  postBody: String,
  comments: [
    {
      user: String,
      commentBody: String,
      date: String,
      replies: [
        {
          user: String,
          replyBody: String,
          date: String,
        },
      ],
    },
  ],
  reactions: [
    {
      user: String,
    },
  ],
  date: String,
});
module.exports = mongoose.model('Post', PostSchema);
