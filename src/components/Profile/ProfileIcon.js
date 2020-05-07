import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      avatar: 'http://tachyons.io/img/logo.jpg'
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  componentDidMount() {
    console.log("DidMount");
    this.setState({
      avatar: this.props.user.avatar
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.avatar === this.props.user.avatar) {
      return null
    } else {
      setTimeout( () => {
        this.updateAvatar();
      }, 500);
    }
  }

  updateAvatar = () => {
      this.setState({
        avatar: this.props.user.avatar
      })
  }

  render () {
    return (
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
            style={{cursor: 'pointer'}}
          >
            <img
                src={this.state.avatar}
                className="br-100 h3 w3 dib" alt="avatar" />
          </DropdownToggle>
          <DropdownMenu
            right
            className="b--transparent shadow-5"
            style={{backgroundColor: 'rgba(255,255,255,0.8)', right: '0'}}>
            <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
            <DropdownItem onClick={() => this.props.onRouteChange('signout')}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
