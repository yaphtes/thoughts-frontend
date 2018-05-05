import React, { Component, Fragment } from 'react';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Favorite from 'material-ui/svg-icons/action/favorite';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Comments from 'material-ui/svg-icons/communication/message';
import Send from 'material-ui/svg-icons/content/send';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import { ToolbarStyled } from './styled';
import { red500 } from 'material-ui/styles/colors';
import { accentColor } from '../vars';
import { connect } from 'react-redux';
import api from '../../services/api';
import { fileServer } from '../../variables';


class Toolbar extends Component {
  state = {
    commentsCount: null,
    commentsIsHidden: true,
    currentCommentInput: '',
    comments: [],
    initCommentsLoaded: false
  }

  normalizeDate(date) {
    function normalize(stuff) {
      return String(stuff).length === 2 ? stuff : '0' + stuff;
    }

    const hours = normalize(date.getHours());
    const minutes = normalize(date.getMinutes());
  
    const day = normalize(date.getDate());
    const month = normalize(date.getMonth() + 1);
    const year = String(date.getFullYear()).slice(2);

    return { hours, minutes, day, month, year };
  }

  handleClickComments = async () => {
    const { postId } = this.props;
    const { initCommentsLoaded } = this.state;
    if (!initCommentsLoaded) {
      const comments = await api.getPostCommentsByPostId(postId);
      this.setState({ comments, commentsIsHidden: false, initCommentsLoaded: true });
    } else {
      this.setState(state => ({ commentsIsHidden: !state.commentsIsHidden }));
    }
  }

  handleAddComment = async () => {
    const { currentCommentInput: comment } = this.state;
    if (!comment.trim()) return;
    const { avatar, myId, postId, username } = this.props;

    const postedComment = await api.postComment({ comment, avatar, myId, postId, username });
    this.setState(state => {
      return {
        comments: [...state.comments, postedComment],
        commentsCount: state.commentsCount ? state.commentsCount + 1 : this.props.commentsCount + 1
      };
    });
  }

  render() {
    const {
      favorited,
      likes,
      date: ms,
      commentsCount,
      handleToggleLike,
      currentCommentInput,
      avatar,
      myId
    } = this.props;
    const { comments, commentsIsHidden } = this.state;
    const date = new Date(ms);
    const { hours, minutes, day, month, year } = this.normalizeDate(date);
    const freshCommentsCount = !this.state.commentsCount ? commentsCount : this.state.commentsCount;

    return (
      <ToolbarStyled>
        <div className="info">Likes {likes.length}</div>
        <div className="comments">Comments {freshCommentsCount}</div>
        <div className="top-stuffs">
          <div className="functions">
            <IconButton onClick={handleToggleLike}>
              {favorited ?
                <Favorite color={red500}/>
                :
                <FavoriteBorder/>
              }
            </IconButton>
            <IconButton>
              <Comments onClick={this.handleClickComments}/>
            </IconButton>
          </div>
          <div className="date">{hours}:{minutes} {day}.{month}.{year}</div>
        </div>
        {!commentsIsHidden ?
          <Fragment>
            <div className="bottom-stuffs">
              {!comments.length ?
                <div className="empty-comments">Оставьте комментарий первым</div>
                :
                <div className="comments-list">
                  <List>
                    {comments.map((comment, i) => 
                      <ListItem
                        key={i}
                        leftAvatar={<Avatar src={`${fileServer}/${comment.userId}/${comment.avatar}`} />}
                        primaryText={comment.username}
                        secondaryText={comment.comment}
                        secondaryTextLines={2}
                      />
                    )}
                  </List>
                </div>
              }
              <div className="put-comments">
                {/* <Avatar src={`${fileServer}/${myId}/${avatar}`} className="avatar" /> */}
                <TextField
                  floatingLabelText="Оставить комментарий"
                  floatingLabelFocusStyle={{ color: accentColor }}
                  underlineFocusStyle={{ borderColor: accentColor }}
                  multiLine={true}
                  className="send-input"
                  value={this.state.currentCommentInput}
                  onChange={event => this.setState({ currentCommentInput: event.target.value })}
                />
                <IconButton className="send-btn" onClick={this.handleAddComment}>
                  <Send color={accentColor} />
                </IconButton>
              </div>
            </div>
          </Fragment>
          :
          null
        }
      </ToolbarStyled>
    );    
  }
}


function mapStateToProps({ user }) {
  return { avatar: user.avatar, myId: user._id, username: user.username };
}

export default connect(mapStateToProps)(Toolbar);