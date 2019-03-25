import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { clearUser } from '../../ducks/reducer'
import logo from "../../../src/components/images/onlyLogo.png"

class Nav extends Component {
  constructor(props){
    super(props)

    this.state ={
      navWidth: 0,
      showHamburger:'',
    }
  }

  openNav = () => {
    this.setState({
      navWidth: 250,
      showHamburger: 0,
    })
  }

  closeNav = () => {
    this.setState({
      navWidth: 0,
      showHamburger: 1
    })
  }

  logout = async () => {
    await axios.post('/api/auth/logout');
    this.props.clearUser()
    await this.props.history.push('/');
  }

  logClose = () => {
    this.closeNav();
    this.logout();

  }
  

  render() {
    const {profile_pic} = this.props


    if (this.props.location.pathname !== '/' && this.props.location.pathname !== '/register'){
      return(
        <div class="navbar">
          <div id="mySidenav" className="sidenav" style={{width: this.state.navWidth}}>
            <ul>
              <a id="btn" class="navText"  className="closebtn" onClick={this.closeNav}><i class="fas fa-minus-square"></i></a>
              <Link class="link" to={'/new_game'}>
                <a class="navText" onClick={this.closeNav} >New Game</a>
              </Link>

              <Link class="link" to={'/profile'}>
                <a class="navText" onClick={this.closeNav} >Profile</a>
              </Link>

              <Link class="link" to={'/played'}>
                <a class="navText" onClick={this.closeNav} >Gallery</a>
              </Link>
              <a class="navText" onClick={this.logClose}>Logout</a>

            </ul>
          </div>
          <a id="btn" class="openBtn" onClick={this.openNav} style={{opacity: this.state.showHamburger}} ><i class="fas fa-plus-square"></i></a>
              <div class="navLogoWrap"> 
                <img class="navlogo" src={logo} alt="doodler"/>
              </div>
              <img src={profile_pic} class="navlogo" />
        </div>
      )
      
    } else {
      return null

    } 
  }
}

const mapStateToProps = reduxState => {
  return {
    id: reduxState.id,
    username: reduxState.username,
    profile_pic: reduxState.profile_pic
  }
  
}
const mapDispatchToProps = {
  clearUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));