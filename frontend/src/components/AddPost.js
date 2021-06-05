import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Posts from './Posts';
class AddPost extends React.Component {
  state = {
    topics: [
      'HTML',
      'CSS',
      'Javascript',
      'Java',
      'PHP',
      'C++',
      'Python',
      'vb6',
    ],
    showMore: true,
    firstTopic: 0,
    firstDisplay: [],
    createPost: false,
    inputPost: '',
    editPostBody: '',
    editPostId: '',
    placeHolder: this.props.user
      ? "What's on your mind, " +
        this.props.user.username.slice(0, 1).toUpperCase() +
        this.props.user.username.slice(1) +
        '?'
      : "What's on your mind?",
    redirectToRegister: false,
    selectTopic:
      this.props.editPost == '' ? 'Topic' : this.props.editPost.title,
    showSelectTopic: false,
  };
  componentDidUpdate = (prev) => {
    if (prev.editPost !== this.props.editPost) {
      this.setState({
        editPostBody: this.props.editPost.postBody,
        editPostId: this.props.editPost._id,
        selectTopic: this.props.editPost.title,
      });
    }
  };
  realtimeUpdate = () => {
    axios.get(this.props.url + '/getposts').then((posts) => {
      console.log(posts.data);
      this.props.dispatchPOsts(posts.data);
    });
  };
  selectTopic = (e) => {
    this.setState({
      selectTopic: e.target.textContent,
      showSelectTopic: false,
    });
  };
  addPost = () => {
    if (!this.props.user) {
      if (window.confirm('You should be logged in')) {
        this.setState({
          redirectToRegister: true,
        });
        return;
      } else {
        return;
      }
    }
    this.setState({
      createPost: true,
    });
  };
  showEditForm = () => {
    this.setState({
      createPost: true,
    });
  };
  submitPost = () => {
    let title;
    if (
      this.state.selectTopic == 'Topic' ||
      this.state.selectTopic == 'Other'
    ) {
      title = 'GENERAL';
    } else {
      title = this.state.selectTopic;
    }
    let post = {
      user: this.props.user.username,
      title: title,
      postBody: this.state.inputPost,
      date: new Date(),
    };
    // return console.log(post);
    axios.post(this.props.url + '/addpost', post).then((post) => {
      if (post.data.error) {
        alert(post.data.error);
      } else {
        alert('post submitted');
        this.realtimeUpdate();
        this.closeCreatePost();
      }
    });
  };
  updatePost = () => {
    let updatedPost = {
      title: this.state.selectTopic,
      postBody: this.state.editPostBody,
      date: new Date(),
    };
    axios
      .put(this.props.url + '/updatepost/' + this.state.editPostId, updatedPost)
      .then((updatedPost) => {
        if (updatedPost.data.error) {
          alert('may error');
          console.log(updatedPost.data.error);
        } else {
          alert('Updated');
          this.realtimeUpdate();
          this.closeCreatePost();
        }
      });
  };
  closeCreatePost = () => {
    this.setState({
      createPost: false,
      inputPost: '',
      editPostBody: '',
      selectTopic: 'Topic',
    });

    this.props.clearEditPost('');
  };
  render() {
    console.log(this.props.posts);
    return (
      <>
        {this.state.redirectToRegister && <Redirect to="/register" />}
        <div className="div-main">
          {/* add post */}
          <div className="div-add-post">
            <div className="div-for-profile">
              {this.props.user
                ? this.props.user.username.slice(0, 1).toUpperCase()
                : '?'}
            </div>
            <div className="div-add-post-text" onClick={this.addPost}>
              <span>{this.state.placeHolder}</span>
            </div>
          </div>

          {/* main posts */}
          {this.props.posts.length > 0 ? (
            this.props.posts.map((post) => {
              return (
                <Posts
                  post={post}
                  key={post._id}
                  showEditForm={this.showEditForm}
                  callRealTimeUpdate={this.realtimeUpdate}
                />
              );
            })
          ) : (
            <div>NO POST</div>
          )}
        </div>
        {this.state.createPost ? (
          <div className="main-modal">
            <div className="mini-modal">
              <div className="create-post-body">
                <div className="create-post-header">
                  {this.props.editPost == '' ? (
                    <span className="create-post-text">Create Post</span>
                  ) : (
                    <span className="create-post-text">Update Post</span>
                  )}
                  <span
                    className="close-create-post"
                    onClick={this.closeCreatePost}
                  >
                    X
                  </span>
                </div>
                <div className="user-profile-create-post">
                  <div className="div-profile">
                    {this.props.user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="div-user-name">
                    <p className="name-of-user">
                      {this.props.user.username.slice(0, 1).toUpperCase() +
                        this.props.user.username.slice(1)}
                    </p>
                    <p className="select-topic">
                      {this.state.selectTopic}{' '}
                      <i
                        className="fas fa-caret-down"
                        onClick={() => {
                          this.setState({
                            showSelectTopic: !this.state.showSelectTopic,
                          });
                        }}
                      ></i>
                    </p>
                    {this.state.showSelectTopic ? (
                      <div className="topic-container">
                        <p onClick={this.selectTopic}>HTML</p>
                        <p onClick={this.selectTopic}>CSS</p>
                        <p onClick={this.selectTopic}>Javascript</p>
                        <p onClick={this.selectTopic}>PHP</p>
                        <p onClick={this.selectTopic}>Other</p>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {/* for add post */}
                {this.props.editPost == '' ? (
                  <div>
                    <div className="div-for-text-area">
                      <textarea
                        placeholder={this.state.placeHolder}
                        cols="10"
                        rows="10"
                        onChange={(e) => {
                          this.setState({
                            inputPost: e.target.value,
                          });
                        }}
                      ></textarea>
                    </div>
                    <div className="div-post-btn">
                      {this.state.inputPost !== '' ? (
                        <button className="post-btn" onClick={this.submitPost}>
                          Post
                        </button>
                      ) : (
                        <button className="post-btn-disabled">Post</button>
                      )}
                    </div>
                  </div>
                ) : (
                  // for edit post
                  <div>
                    <div className="div-for-text-area">
                      <textarea
                        cols="10"
                        rows="10"
                        value={this.state.editPostBody}
                        onChange={(e) => {
                          this.setState({
                            editPostBody: e.target.value,
                          });
                        }}
                      ></textarea>
                    </div>
                    <div className="div-post-btn">
                      <button className="post-btn" onClick={this.updatePost}>
                        Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    url: store.url,
    user: store.user,
    posts: store.posts,
    editPost: store.editPost,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchPOsts: (posts) =>
      dispatch({
        type: 'POSTS_TO_STORE',
        payload: posts,
      }),
    clearEditPost: (arg) =>
      dispatch({
        type: 'CLEAR_EDITPOST',
        payload: arg,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
