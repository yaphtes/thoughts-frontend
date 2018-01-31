import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Collections from 'material-ui/svg-icons/image/collections';
import Background from 'material-ui/svg-icons/image/texture';
import Eject from 'material-ui/svg-icons/action/eject';
import Button from '../Button';
import { accentColor, POST_ARTICLE } from '../../variables';
import './creature.css';
import Preview from '../Preview';

const styles = {
  button: {
    cursor: 'default'
  },

  icon: {
    width: 24,
    height: 24,
    fill: accentColor
  },
  iconAround: {
    width: 48,
    height: 48,
    padding: 12
  },
  file: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  }
};

class Creature extends Component {
  state = {
    title: '',
    content: '',
    preview: null,
    previewWindowIsVisible: true,
    collection: [],
  };

  handleDeletePreview = () => {
    this.setState({ preview: null });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id, handlePostArticle } = this.props;
    const { title, content, preview, collection } = this.state;
    const article = {
      title,
      content,
      preview,
      collection
    };

    handlePostArticle({ article, id });
  }

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
  }

  handleChangeContent = ({ target }) => {
    this.setState({ content: target.value });
  }

  handleChangePreview = ({ target }) => {
    if (target.files) {
      const file = target.files[0];
      this.setState({ preview: file });
    }
  }

  handleChangePreviewVisible = () => {
    this.setState({ previewWindowIsVisible: !this.state.previewWindowIsVisible });
  }

  handleChangeCollection = ({ target }) => {
    if (target.files) {
      let collection = [];
      for (let photo of target.files) {
        collection.push(photo);
      }
      this.setState({ collection });
    }
  }

  render() {
    let { title, content, preview, collection, previewWindowIsVisible } = this.state;
    const { avatar } = this.props;

    return (
      <div className="creature">
        <div className="wrap">
          <div className="toolkits">
            <Button
              icon={previewWindowIsVisible ? VisibilityOff : Visibility}
              onClick={this.handleChangePreviewVisible}
              tooltip={previewWindowIsVisible ? 'Close preview' : 'Open preview'}
              touch={true}
              iconStyle={styles.icon}
              style={{ ...styles.button, ...styles.iconAround }}
            />
            { !preview ?
              <Button
                icon={Background}
                tooltip="Add preview"
                touch={true}
                iconStyle={styles.icon}
                style={{ position: 'relative', ...styles.button, ...styles.iconAround }}>
                <label className="file"><input onChange={this.handleChangePreview} type="file"/></label>
              </Button>
              :
              <Button
                icon={Eject}
                onClick={this.handleDeletePreview}
                tooltip="Delete preveiw"
                touch={true}
                iconStyle={styles.icon}
                style={{ position: 'relative', ...styles.button, ...styles.iconAround }}
              />
            }
            <Button
              touch={true}
              icon={Collections}
              iconStyle={styles.icon}
              tooltip="Change colleciton of photos"
              style={{ position: 'relative', ...styles.button, ...styles.iconAround }}>
              <label className="file"><input type="file" onChange={this.handleChangeCollection} multiple={true} /></label>
            </Button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <TextField
              fullWidth={true}
              floatingLabelText="Title"
              hintText="Write a title"
              floatingLabelFocusStyle={{ color: accentColor }}
              underlineFocusStyle={{ borderColor: accentColor }}
              onChange={this.handleChangeTitle}
            />
            <TextField
              floatingLabelText="Content"
              hintText="Write a content"            
              fullWidth={true}
              multiLine={true}
              rows={10}
              floatingLabelFocusStyle={{ color: accentColor }}
              underlineFocusStyle={{ borderColor: accentColor }}
              onChange={this.handleChangeContent}
            />
            <Button
              raised={true}
              label="submit"
              type="submit"
              color="#fff"
              backgroundColor={accentColor}
            />
          </form>
          { previewWindowIsVisible ?
            <Fragment>
              <Preview
                avatar={avatar}
                title={title}
                content={content}
                preview={preview}
              />
            </Fragment>
            : null
          }
          { collection.length ?
            <Fragment>
              <h3 className="head">Коллекция фотографий</h3>
              <div className="collection">
                {collection.map((photo, i) => <div key={i} className="photo">
                  <img src={URL.createObjectURL(photo)} alt=""/>
                </div>)}
              </div>
            </Fragment>
            : null
          }
        </div>        
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  const { avatar, _id: id } = user;

  return { avatar, id };
}

function mapDispatchToProps(dispatch) {
  return {
    handlePostArticle({ article, id }) {
      dispatch({ type: POST_ARTICLE, payload: { article, id } });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Creature);