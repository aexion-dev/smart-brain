import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import SourceImage from './components/Results/SourceImage';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'YOUR_API_KEY'
});

const particlesOptions = {
  "particles": {
      "number": {
          "value": 50
      },
      "size": {
          "value": 3
      }
  },
  "interactivity": {
      "events": {
          "onhover": {
              "enable": true,
              "mode": "repulse"
          }
      }
  }
}

const initialState = {
  input: '',
  imageURL: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: '',
    age: '',
    pet: '',
    avatar: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          fetch(`http://localhost:3001/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.email) {
                this.loadUser(user);
                this.onRouteChange('home');
              }
            })
        }
      })
      .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined,
      age: data.age,
      pet: data.pet,
      avatar: data.avatar
    }});
  }

  calcFaceLocation = (data) => {
    if(data && data.outputs) {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      return data.outputs[0].data.regions.map(face => {
        const clarifaiData = face.region_info.bounding_box;
        return {
          leftCol : clarifaiData.left_col * width,
          topRow : clarifaiData.top_row * height,
          rightCol : width - (clarifaiData.right_col * width),
          bottomRow : height - (clarifaiData.bottom_row * height)
        }
      });
    }
    return
  }

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({boxes: boxes});
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});

    app.models.predict(
      "a403429f2ddf4b49b307e318f00e528b",
      this.state.input)
      .then(response => {
        if(response) {
          const faceCount = response.outputs[0].data.regions.length;
          console.log(faceCount);
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id,
              count: faceCount
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
          this.displayFaceBox(this.calcFaceLocation(response))
      })
      .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      fetch('http://localhost:3001/signout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: window.sessionStorage.getItem('token')
        })
      })
      .catch(error => console.log(error));

      window.sessionStorage.removeItem('token');
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render () {
    const { isSignedIn, imageURL, route, boxes, isProfileOpen, user } = this.state;

    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
          user={user}/>
        { isProfileOpen &&
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={user}/>
          </Modal>
        }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <SourceImage boxes={boxes} imageURL={imageURL}/>
            </div>
          : (
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
