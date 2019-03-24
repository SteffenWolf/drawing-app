import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { clearUser } from '../../ducks/reducer'
import {logo} from '../images/test.png'

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
      showHamburger: 'hidden'
    })
  }

  closeNav = () => {
    this.setState({
      navWidth: 0,
      showHamburger: 'visible'
    })
  }

  logout = async () => {
    await axios.post('/api/auth/logout');
    this.props.clearUser()
    await this.props.history.push('/');
  }
  

  render() {
    const {profile_pic} = this.props


    if (this.props.location.pathname !== '/' && this.props.location.pathname !== '/register'){
      return(
        <div class="navbar">

        <img src={logo} alt="logo"/>
          <div id="mySidenav" className="sidenav" style={{width: this.state.navWidth}}>
            <ul>
              <span id="btn" class="navText"  className="closebtn" onClick={this.closeNav}><i class="fas fa-minus-square"></i></span>

              <Link to={'/new_game'}>
                <span class="navText" >New Game</span>
              </Link>

              <Link to={'/played'}>
                <span class="navText" >Gallery</span>
              </Link>
              <span class="navText" onClick={this.logout}>Logout</span>

            </ul>
          </div>
          <span id="btn" class="openBtn" onClick={this.openNav} style={{visibility: this.state.showHamburger}} ><i class="fas fa-plus-square"></i></span>
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