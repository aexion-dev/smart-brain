import React from 'react';
import mime from 'mime-types';

class UploadPhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileURL: 'http://tachyons.io/img/logo.jpg',
      avatar: this.props.user.avatar
    };
  }

  updateFileURL = (Key, ContentType) => {
    let url = new URL('http://localhost:3001/generate-get-url')
    url.search = new URLSearchParams({
      Key,
      ContentType
    })

    fetch(url, {
      method: 'get',
    }).then(response => response.text())
    .then(newURL => {
      fetch(`http://localhost:3001/profile/${this.props.user.id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          formInput: {
            avatar: newURL
          }
        })
      }).then(resp => {
        if(resp.status === 200 || resp.status === 304) {
          const data = {
            avatar: newURL
          }
          this.props.loadUser({ ...this.props.user, ...data});
        }
      }).catch(console.log)
    })
  }

  submitFile = (event) => {
    event.preventDefault();
    const { file } = this.state;
    const ext = mime.extension(file[0].type);
    let url = new URL('http://localhost:3001/generate-put-url')
    url.search = new URLSearchParams({
      Key: `${this.props.user.id}.${ext}`,
      ContentType: file[0].type
    })

    fetch(url, {
      method: 'get',
    })
    .then(response => response.text())
    .then(putURL => {
      fetch(putURL, {
        method: 'put',
        body: file[0]
      })
    })

    this.updateFileURL(`${this.props.user.id}.${ext}`, file[0].type);
  }

  handleFileUpload = (event) => {
    this.setState({
      file: event.target.files,
      avatar: URL.createObjectURL(event.target.files[0])
    });
  }

  render () {
    return (
      <div>
        <img
          src={this.state.avatar}
          className="br-100 h3 w3 dib" alt="avatar" />
        <form onSubmit={this.submitFile}>
          <input type='file' onChange={this.handleFileUpload} />
          <button type='submit'>Save</button>
        </form>
      </div>
    );
  }
}

export default UploadPhoto;
