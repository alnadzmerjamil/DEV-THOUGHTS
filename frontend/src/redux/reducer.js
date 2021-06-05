const initialState = {
  url: 'http://localhost:5000',
  user: localStorage.getItem('blog_user')
    ? JSON.parse(localStorage.getItem('blog_user'))
    : null,
  posts: [],
  editPost: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_ACCOUNT':
      localStorage.setItem('blog_user', JSON.stringify(action.payload));
      return {
        ...state,
        user: JSON.parse(localStorage.getItem('blog_user')),
      };
    case 'LOG_OUT':
      localStorage.removeItem('blog_user');
      return {
        ...state,
        user: null,
      };
    case 'POSTS_TO_STORE':
      return {
        ...state,
        posts: action.payload,
      };
    case 'EDIT_POST':
      return {
        ...state,
        editPost: action.payload,
      };

    case 'CLEAR_EDITPOST':
      return {
        ...state,
        editPost: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
