const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');

const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connection to db is stable');
});

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// model is imported here
const User = require('./models/User');
const Post = require('./models/Post');

const auth = require('./auth');

// Accessing the path module
// const path = require('path');

// // Step 1:
// app.use(express.static(path.resolve(__dirname, './client/build')));
// // Step 2:
// app.get('*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, './client/build', index.html));
// });

//
app.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }).then((username) => {
    if (username) {
      res.send({ error: 'username is already used' });
    } else {
      User.findOne({ emailAddress: req.body.emailAddress }).then((email) => {
        if (email) {
          res.send({ error: 'email address is already used' });
        } else {
          bcrypt.hash(req.body.password, 10).then((hashedPW) => {
            const newUser = new User(req.body);
            newUser.password = hashedPW;
            newUser.save().then((user) => {
              res.send(user);
            });
          });
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((match) => {
        if (match) {
          let token = auth.createAccessToken(user);
          res.send({ user, token });
        } else {
          res.send({ error: 'Incorrect password' });
        }
      });
    } else {
      User.findOne({ emailAddress: req.body.username }).then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((match) => {
            if (match) {
              let token = auth.createAccessToken(user);
              res.send({ user, token });
            } else {
              res.send({ error: 'Incorrect password' });
            }
          });
        } else {
          res.send({ error: 'Incorrect username/email' });
        }
      });
    }
  });
});
app.post('/addpost', (req, res) => {
  console.log(req.body);
  // return;
  let newPost = new Post(req.body);
  newPost.save().then((post) => {
    res.send(post.postBody);
  });
});

app.get('/getposts', (req, res) => {
  Post.find().then((posts) => {
    res.send(posts);
  });
});

app.put('/updatepost/:_id', (req, res) => {
  Post.findByIdAndUpdate(req.params._id, req.body).then((updatedPost) => {
    res.send(updatedPost);
  });
});

app.delete('/deletepost/:_id', (req, res) => {
  Post.findByIdAndDelete(req.params._id).then((originalPost) => {
    res.send(originalPost);
  });
});

app.put('/likepost/:_id', (req, res) => {
  if (req.body.unlike) {
    Post.findById(req.params._id).then((post) => {
      if (post) {
        post.reactions.forEach((e, i) => {
          if (e.user == req.body.user) {
            post.reactions.splice(i, 1);
          }
        });
        post.save().then((post) => {
          res.send(post);
        });
      } else {
        res.send({ error: 'Something went wrong' });
      }
    });
  } else {
    Post.findById(req.params._id).then((post) => {
      if (post) {
        post.reactions.push(req.body);
        post.save().then((postCommented) => {
          res.send(postCommented);
        });
      } else {
        res.send({ error: 'Something went wrong' });
      }
    });
  }
});

app.put('/addcomment/:_id', (req, res) => {
  Post.findById(req.params._id).then((post) => {
    if (post) {
      post.comments.push(req.body);
      post.save().then((postCommented) => {
        res.send(postCommented);
      });
    } else {
      res.send({ error: 'Something went wrong' });
    }
  });
});
//
app.listen(port, () => {
  console.log('app is running on port 5000');
});
