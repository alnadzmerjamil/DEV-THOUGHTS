import axios from 'axios';
import e from 'cors';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
class Posts extends React.Component {
  state = {
    post: this.props.post,
    editDeleteOption: false,
    commentBody: '',
    showCommentBody: false,
    liked: false,
    redirectToRegister: false,
  };
  componentDidMount = () => {
    if (this.props.user) {
      let liked = this.props.post.reactions.filter(
        (user) => user.user == this.props.user.username
      );
      if (liked.length !== 0) {
        this.setState({
          liked: true,
        });
      }
    }
  };
  editPost = () => {
    this.props.editPost(this.state.post);
    this.props.showEditForm(true);
    this.setState({
      editDeleteOption: false,
    });
  };
  deletePost = () => {
    if (window.confirm('Are you sure to delete?')) {
      axios
        .delete(this.props.url + '/deletepost/' + this.state.post._id)
        .then((deleted) => {
          if (!deleted.data.error) {
            alert('Post has been deleted');
            this.props.callRealTimeUpdate();
          }
        });
    } else {
      this.setState({
        editDeleteOption: false,
      });
    }
  };
  likePost = () => {
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
      liked: true,
    });
    axios
      .put(this.props.url + '/likepost/' + this.state.post._id, {
        user: this.props.user.username,
      })
      .then((like) => {
        if (like.data.error) {
          alert('error');
        } else {
          alert('you liked the post');
          this.props.callRealTimeUpdate();
        }
      });
  };
  unLikePost = () => {
    this.setState({
      liked: false,
    });
    axios
      .put(this.props.url + '/likepost/' + this.state.post._id, {
        unlike: true,
        user: this.props.user.username,
      })
      .then((like) => {
        if (like.data.error) {
          alert('error');
        } else {
          alert('you unliked the post');
          this.props.callRealTimeUpdate();
        }
      });
  };
  showCommentBody = () => {
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
      showCommentBody: true,
    });
  };
  addComment = () => {
    let comment = {
      user: this.props.user.username,
      commentBody: this.state.commentBody,
      date: new Date(),
    };
    axios
      .put(this.props.url + '/addcomment/' + this.state.post._id, comment)
      .then((updatedPost) => {
        if (updatedPost.data.error) {
          alert('may error');
          console.log(updatedPost.data.error);
        } else {
          alert('Your comment is posted');
          this.setState({
            commentBody: '',
          });
          this.props.callRealTimeUpdate();
        }
      });
  };
  render() {
    console.log(this.props.user);
    return (
      <div className="div-per-post">
        {this.state.redirectToRegister && <Redirect to="/register" />}
        <div className="div-for-profile-per-post">
          <div className="div-profile">
            {this.props.post.user.slice(0, 1).toUpperCase()}
          </div>
          <div className="div-user-name">
            <p className="name-of-user">@ {this.props.post.user}</p>
            <small className="sml-timestamp">
              {this.props.post.date.slice(0, 10)}
            </small>
            {this.props.user ? (
              this.props.user.username == this.props.post.user ? (
                <i
                  className="fas fa-ellipsis-h"
                  onClick={() => {
                    this.setState({
                      editDeleteOption: !this.state.editDeleteOption,
                    });
                  }}
                ></i>
              ) : (
                ''
              )
            ) : (
              ''
            )}
            {this.state.editDeleteOption ? (
              <div className="div-edit-delete-post">
                <p onClick={this.editPost}>
                  <i className="fas fa-pencil-alt"></i> Edit
                </p>
                <p onClick={this.deletePost}>
                  <i className="far fa-trash-alt"></i> Delete
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <p className="post-body">
          <span className="post-title">{this.props.post.title}</span>
          {this.props.post.postBody}
        </p>
        <div className="div-for-like-comment">
          <div className="div-for-count-like-comment">
            {this.props.post.reactions.length !== 0 ? (
              <span className="likes-count">
                <i className="fas fa-thumbs-up total-likes"></i>{' '}
                {this.props.post.reactions.length}
              </span>
            ) : (
              <span className="likes-count"></span>
            )}
            {this.props.post.comments.length > 1 ? (
              <span className="comments-count">
                {this.props.post.comments.length} Comments
              </span>
            ) : (
              <span className="comments-count">
                {this.props.post.comments.length} Comment
              </span>
            )}
          </div>
          <div className="div-for-interact-like-comment">
            {this.state.liked ? (
              <span className="spn-like" onClick={this.unLikePost}>
                <i className="far fa-thumbs-up thumbs-liked"></i> Unlike
              </span>
            ) : (
              <span className="spn-like" onClick={this.likePost}>
                <i className="far fa-thumbs-up"></i> Like
              </span>
            )}

            <span className="spn-comment" onClick={this.showCommentBody}>
              <i className="far fa-comment-alt"></i> Comment
            </span>
            {/* <span className="spn-share">Share</span> */}
          </div>
          {/* show comments */}
          <div className="div-for-show-comments">
            <div>View previous comments</div>
            <div className="all-comments">
              {this.props.post.comments.map((comment) => {
                return (
                  <div className="user-profile-comment" key={comment._id}>
                    <div className="user-profile">
                      {comment.user.slice(0, 1).toUpperCase()}
                    </div>
                    <p className="user-comment-body">
                      <span className="spn-user-name">By {comment.user}</span>
                      {comment.commentBody}
                    </p>
                    <div className="interect-comment">
                      <span>Reply</span>
                      {this.props.user ? (
                        this.props.user.username == comment.user ? (
                          <span>
                            <span>Edit</span>
                            <span>Delete</span>
                          </span>
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* you */}
            {this.state.showCommentBody ? (
              <div className="user-profile-comment my-profile-at-comment">
                <div className="user-profile">
                  {this.props.post.user.slice(0, 1).toUpperCase()}
                </div>
                <input
                  className="ipt-comment"
                  placeholder="Write your comment..."
                  value={this.state.commentBody}
                  onChange={(e) => {
                    this.setState({
                      commentBody: e.target.value,
                    });
                  }}
                ></input>
                <div className="div-commnet-btn">
                  {this.state.commentBody !== '' ? (
                    <button className="comment-btn" onClick={this.addComment}>
                      Comment
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    url: store.url,
    user: store.user,
    posts: store.posts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    editPost: (post) =>
      dispatch({
        type: 'EDIT_POST',
        payload: post,
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Posts);
