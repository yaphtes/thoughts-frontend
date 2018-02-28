import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostPreview from './PostPreview';
import { PostsStyled } from './styled';
import List from '../List';

class Posts extends Component {
  state = {
    addingIsOpen: false
  };

  render() {
    const { posts } = this.props;
    const users = [
      {
        userId: '5a9425cece62621f7021a55e',
        avatar: 'avatar-33990',
        username: 'colento',
        firstname: 'Alex',
        lastname: 'Fill'
      },
      {
        userId: '5a9425cece62621f7021a55e',
        avatar: 'avatar-33990',
        username: 'summit',
        firstname: 'John',
        lastname: 'Filling'
      }
    ];

    return (
      <PostsStyled>
        <div className="publications">
          {posts.map((postId, i) =>
            <div key={i} className="post">
              <PostPreview postId={postId} />
            </div>
          )}
        </div>
        <div className="subs">
          <List head="My Subscriptions" type="subscriptions" users={users} />
          <List head="Subscribes" type="subscribes" users={users} />
        </div>
      </PostsStyled>
    );
  }
}

function mapStateToProps({ user }) {
  let posts;
  const isMainUser = true;
  if (isMainUser) {
    posts = user.posts;
  } else {
    // посты пользователя с другим id
    posts = [];
  }
  return { posts };
}

export default connect(mapStateToProps)(Posts);