import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { clearUser } from '../../ducks/reducer'

class Nav extends Component {
  constructor(props){
    super(props)

    this.state ={}
  }

  logout = async () => {
    await axios.post('/api/auth/logout');
    this.props.clearUser()
    await this.props.history.push('/');
  }

  render() {
    if (this.props.location.pathname !== '/' && this.props.location.pathname !== '/register'){
      return(
        <div>
          <Link to={'/board'}><button>Current Game</button></Link>
          <Link to={'/new_game'}><button>New Game</button></Link>
          <button onClick={this.logout}>Logout</button>
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
    username: reduxState.username
  }
  
}
const mapDispatchToProps = {
  clearUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));